#this will be our retririever, which we will use to retrieve relevant docuements
#we want to store documents permanently and we will us chroma db for that

from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
from langchain_core.documents import Document


#we will use ollama embeddings to convert our documents into vectors

embeddings  = OllamaEmbeddings(model = "embeddinggemma:300m")

db_location  = "../../../chroma_langchain.db"


#if we have to add docuements or if we have already done it
add_documents = not os.path.exists(db_location)


if add_documents:

    #we will add some documents to our chroma db
    documents = []
    ids = []
    with open("../../../documents.txt", "r") as f:
        info = f.read()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0)
        chunks = text_splitter.split_text(info)
    for i,chunk in enumerate(chunks):
        documents.append(Document(page_content=chunk, 
                                  metadata={"source": f"document_{i}"},
                                  id = str(i)))
        ids.append(str(i))
vector_store = Chroma(collection_name="amir_info_collection", 
                      embedding_function=embeddings, 
                      persist_directory=db_location)
if add_documents:
    vector_store.add_documents(documents = documents,ids= ids)

#now we have to be able to query our vector store

retriever  = vector_store.as_retriever(search_kwargs={"k": 10})








