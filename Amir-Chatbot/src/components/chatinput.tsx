import useAutoSize from "../hooks/useAutoSize";
import React from "react";
import { IoIosSend } from "react-icons/io";
import "./chatbot.css";

interface ChatInputProps {
    newMessage:string;
    isLoading:boolean;
    setNewMessage:React.Dispatch<React.SetStateAction<string>>;
    submitNewMessage:() => Promise<void>;
}

    

function ChatInput({newMessage,isLoading, setNewMessage,submitNewMessage}:ChatInputProps) {
    //using autoref to resize text area based on content
    const textareaRef = useAutoSize(newMessage);

    function handlekeyDown(e:React.KeyboardEvent<HTMLTextAreaElement>){
        if( e.key === "Enter" && !e.shiftKey && !isLoading){
            //prevents page from reloading
            e.preventDefault();
            submitNewMessage();
        }
    }

    return (
    <div className = "chat-input-outer">
        <div className = "chat-input">
            <textarea
                id = "chat-input-textarea"
                className = "chat-textarea"
                ref = {textareaRef}
                placeholder="Ask me anything about Amir"
                rows = {1}
                value = {newMessage}
                onChange = {(e) => setNewMessage(e.target.value)}
                onKeyDown = {handlekeyDown}
            />
            <button className = "chat-input-btn"onClick = {submitNewMessage}>
                <IoIosSend/>
            </button>

        </div>
    </div>
    )
}

export default ChatInput;