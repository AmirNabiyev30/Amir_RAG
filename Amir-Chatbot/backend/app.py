from unittest import result
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.runnables import RunnableConfig
from langchain.tools import tool
from vector import retriever
from pydantic import BaseModel, Field
import time
import json

app = FastAPI()

#we need to add the cors middleware to allow our frontend to safely interact with out API
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

#specify route for API
#now we can utilize our langchain agent to handle the incoming request and generate a response

#specify the agent we want to use and configure it with the tools and middleware we want

@tool
def retrieve_context(query:str) -> str:
    """use this tool to retrieve relevant information about Amir from the vector database, given a query"""
    docs = retriever.invoke(query)
    formatted_docs = []

    for doc in docs:
        # Handle both dicts and Document objects
        metadata = doc.metadata if hasattr(doc, "metadata") else doc.get("metadata", {})
        content = doc.page_content if hasattr(doc, "page_content") else doc.get("page_content", "")

        # Serialize metadata safely
        metadata_str = json.dumps(metadata, indent=2, default=str)

        formatted_docs.append(f"""[SOURCE METADATA]
    {metadata_str}

    [CONTENT]
    {content}""")

    context = "\n\n---\n\n".join(formatted_docs)
    return context

class Answer(BaseModel):
    answer:str = Field(..., description="The answer to the user's question based on the retrieved context.")
model = ChatOllama(model = "llama3.1:8b", format = "json")

checkpointer = InMemorySaver()
agent = create_agent(
    model = model,
    tools = [retrieve_context],
    middleware = [SummarizationMiddleware(model = model, trigger = ("tokens",100), keep = ("messages",20))],
    checkpointer = checkpointer,
    system_prompt= """You are an expert assistant with access to a RAG retrieval tool. You will be provided with a question that is
potentially about Amir, and you can use the 'retrieve_context' tool to get relevant information about Amir. Your goal is to highlight amirs strengths
and talk in a way that makes him seem like an amazing candidate. Using your retrieved context you can go in depth about the skills he needed to display. 

    IMPORTANT RULES:
    - ALWAYS use 'retrieve_context' FIRST for any factual question
    - Base ALL answers strictly on retrieved context
    - Cite sources from metadata in your response
    - If context insufficient, say 'Insufficient information provided' 
    - If answering a question, respond in plain text, not in JSON format
    """,
    response_format=Answer
)

#Now we can use the model to generate response to our queries

#the langchain agent we are using handles the incoming requests through chains
config: RunnableConfig = {"configurable": {"thread_id": "1"}}
class ChatRequest(BaseModel):
    question:str

@app.post("/chat")
async def chat(question:ChatRequest):
    rstime = time.time()
    info = retriever.invoke(question.question)
    retime = time.time()
    retriever_time  = retime - rstime
    pstime = time.time()
    result = agent.invoke({"messages": [{"role": "user", "content": question.question}]}, config=config)
    petime  = time.time()
    prompt_time = petime - pstime
    # Extract AI message content safely
    final_message = result["messages"][-1]
    
    # Try structured first, fallback to content
    try:
        # If structured parsed into additional_content or tool_calls
        if hasattr(final_message, 'additional_kwargs') and 'structured_response' in final_message.additional_kwargs:
            response_text = final_message.additional_kwargs['structured_response']['answer']
        else:
            # JSON string in content (Ollama json_mode)
            response_text = json.loads(final_message.content)['answer']
    except:
        response_text = final_message.content  # Raw fallback
    
    return {"response": response_text, "retriever_time": retriever_time, "prompt_time": prompt_time, "sources": info}



