# Amir's RAG Chatbot


## Project Description
The Retrieval Augemented Generator will pull documents that relate to me inlcuding  my resume, github repos, and my linkedin. The chatbot will use an Ollama model as the LLM and will be able to answer questions about me with less likely chance to hallunicate


## Background
This is a personal project of mine where I wanted to develop my AI engineering skills.


### Tech Stack
Frontend - React with Typescript
Backend - FastAPI
Model - Deepseek R1:1.5B Ollama

### How it was done
The backend utilized langchain to prompt the model and get responses. In terms of the RAG, I used a basic text splitter on a txt file containing all the information and stored it in a chroma vector database




