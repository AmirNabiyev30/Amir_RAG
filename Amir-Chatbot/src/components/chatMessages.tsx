
import Markdown from "react-markdown";
import type { UserMessage, AIMessage } from "./chatbot";
import "./chatbot.css"

interface ChatMessageProps{
    messages:(UserMessage|AIMessage)[];
    isLoading:boolean;
}

function ChatMessages({messages , isLoading}:ChatMessageProps){


    return(
        <div className = "chat-messages">
            {messages.map((message, idx) => (
                <div key={idx} className= { `chat-message-${message.role === "user" ? "user" : "assistant"}` }>
                    { isLoading  && !message.content ?
                        "Loading ..."
                        :message.role === "assistant" ?
                    <Markdown>{message.content}</Markdown>: <div>{message.content}</div>}
                </div>
             ))
            }
        </div>
    )

};

export default ChatMessages;