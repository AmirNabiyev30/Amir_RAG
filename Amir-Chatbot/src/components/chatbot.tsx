import { useState } from "react";
import ChatInput from "./chatinput";
import {useImmer} from "use-immer";
import ChatMessages from "./chatMessages";
import sendMessage from "../api.ts";
import "./chatbot.css";
export interface UserMessage{
        role:string,
        content:string,

    }
export interface AIMessage extends UserMessage{
        sources?:string[],
        loading:boolean
    }

function Chatbot() {
    //State to hold user input 
    //State to hold chatbot response
    const [newMessage,setNewMessage] = useState<string>("");
    const [messages,setMessages] = useImmer<(UserMessage|AIMessage)[]>([])
    const [chatId,setChatId] = useState<number|null>(null)

    const isLoading:boolean = messages.length > 0 && "loading" in messages[messages.length-1] && 
    (messages[messages.length-1] as AIMessage).loading;



    async function submitNewMessage(){
        //This function will handle sending the user message to the backend
       const trimmedMessage = newMessage.trim();
        //if our message is empty or we are waiting for a response, do not send the messaeg
       if (!trimmedMessage || isLoading) {return;}

       //now we add on the messages to our existing list of messages, we add the user message and an empty AI assistant message that will be filled in when we get the response from
       //the backend
       setMessages(draft => {
        draft.push( {role:"user",content:trimmedMessage},{role:"assistant",
            content:"",
            sources:[],
            loading:true})
       });
       setNewMessage("");

       //let chatIdorNew = chatId

       //we are going to make an api call to our backend to get the response from the chatbot

       try{
            //create a new session if needed
            if (!chatId){
                const id = 1;
                setChatId(id);
                //chatIdorNew = id;
            }
            //const response = await aPi.sendMessage(chatIdorNew,trimmedMessage);
            const res = await sendMessage(trimmedMessage)
            //update the last message in the messages array with the response from the chatbot and set loading to false
            setMessages(draft => {
                draft[draft.length-1].content = res.response;
                //(draft[draft.length-1] as AIMessage).sources = response.sources;
                (draft[draft.length-1] as AIMessage).loading = false;
                (draft[draft.length-1] as AIMessage).sources = res.sources;
            });
            console.log("Retriever Time:", res.retriever_time.toFixed(2), "Prompt Time:", res.prompt_time.toFixed(2));
       }
       catch(err){
        console.log(err);
        //if there is an error, we want to remove the loading message and show an error message
        setMessages(draft => {
            draft.pop();
            draft.push({role:"assistant",content:"Something went wrong, give Amir a couple of days to figure out what went wrong.",loading:false,sources:[]})
        });
       }
    }

    return (
    <div>
            <div className = "welcome-message">
            <h1> Amir's Chatbot</h1>
                <p>Ask me anything! I can help with a variety of topics and you can experiment which RAG techniques you want
                    to implement in the backend. Choose your RAG technique below and start chatting!
                </p>
            </div>
        <div className = "chatbot">
            
            {//if there are no messages to be printed, show welcomes message
            messages.length === 0 &&
            <div>
                <h2> Welcome to Amir's Chatbot</h2>
                
             </div>   
            }

            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput
                newMessage = {newMessage}
                setNewMessage = {setNewMessage}
                isLoading = {isLoading}
                submitNewMessage = {submitNewMessage} 
                />
        </div>
    </div>
    )
}
export default Chatbot;
