
import Markdown from "react-markdown";
import type { UserMessage, AIMessage } from "./chatbot";

interface ChatMessageProps{
    messages:(UserMessage|AIMessage)[];
    isLoading:boolean;
}

function ChatMessages({messages , isLoading}:ChatMessageProps){


    return(
        <div>
            {messages.map((message, idx) => (
                <div key={idx} style={{textAlign: message.role === "user" ? "right" : "left"}}>
                    {isLoading ? "Loading..." : message.role === "assistant" ?
                    <Markdown>{message.content}</Markdown>: <div>{message.content}</div>}
                </div>

             ))
            }
        </div>
    )

};

export default ChatMessages;