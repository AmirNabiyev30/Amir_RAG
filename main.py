from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate
from vector import retriever




#We want to use the Ollama LLM in langchain as its open source and free to use.
#The model entirely depends on your hardwarre usage

#we can use deepseeak r1 as our chat model


model  = OllamaLLM(model="deepseek-r1:1.5b")

#Now we can use the model to generate response to our queries
template = """You are trying to get Amir hired and answer the question based on the following context: {context}
question: {question}

Answer in a way that makes Amir look good. Be concise and don't talk about missing information."""

prompt  = PromptTemplate.from_template(template)

chain  = prompt | model
while True:
    print("---------------------")
    user_input = input("Enter your question:")

    if user_input.lower() == "exit":
        break
    print("\n\nGenerating response ...\n\n")
    info  = retriever.invoke(user_input)
    result = chain.invoke({'context': info, 'question': user_input})
    print("AI Result:", result)


