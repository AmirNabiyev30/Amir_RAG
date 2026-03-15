from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate
from vector import retriever
from pydantic import BaseModel
import time

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

#specifify route for API
#now we can utilize our langchain agent to handle the incoming request and generate a response

#specify the model we want to use

model = OllamaLLM(model = "deepseek-r1:1.5b")

#Now we can use the model to generate response to our queries

#the prompt template we are using, designed to optimize for getting Amir hired
template = """You are trying to get Amir hired and answer the question based on the following context: {context},

The question you want to answer is: {question}

Answer in a way that makes Amir look good. Be concise and don't talk about missing information.
If asked for a URL, provide a URL that is relevant to the question"""

prompt  = PromptTemplate.from_template(template)

#the langchain agent we are using handles the incoming requests through chains
chain  = prompt | model

class ChatRequest(BaseModel):
    question:str

@app.post("/chat")
async def chat(question:ChatRequest):
    rstime = time.time()
    info = retriever.invoke(question.question)
    retime = time.time()
    retriever_time  = retime - rstime
    pstime = time.time()
    result = chain.invoke({'context': info, 'question': question.question})
    petime  = time.time()
    prompt_time = petime - pstime
    return {"response":result, "retriever_time": retriever_time, "prompt_time": prompt_time, "sources":info}



