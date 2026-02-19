import useAutoSize from "../hooks/useAutoSize";
import React from "react";
import { IoIosSend } from "react-icons/io";

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
        <div>
            <textarea
                ref = {textareaRef}
                placeholder="Type your message here"
                rows = {1}
                value = {newMessage}
                onChange = {(e) => setNewMessage(e.target.value)}
                onKeyDown = {handlekeyDown}
            />
            <button onClick = {submitNewMessage}>
                <IoIosSend/>
            </button>

        </div>
    )
}

export default ChatInput;