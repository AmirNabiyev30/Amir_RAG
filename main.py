from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate




#We want to use the Ollama LLM in langchain as its open source and free to use.
#The model entirely depends on your hardwarre usage

#we can use deepseeak r1 as our chat model


model  = OllamaLLM(model="deepseek-r1:1.5b")

#Now we can use the model to generate response to our queries
template = """Answer the question based on the following context: {context}
question: {question}"""

prompt  = PromptTemplate.from_template(template)

chain  = prompt | model
while True:
    print("---------------------")
    user_input = input("Enter your question:")

    if user_input.lower() == "exit":
        break
    print("\n\nGenerating response ...\n\n")
    result = chain.invoke({'context': ['A computer science student focusing on AI and machine learning'], 'question': user_input})
    print(result)


