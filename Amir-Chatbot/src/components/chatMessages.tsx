
import Markdown from "react-markdown";
import type { UserMessage, AIMessage } from "./chatbot";
import "./chatbot.css"

interface ChatMessageProps{
    messages:(UserMessage|AIMessage)[];
    isLoading:boolean;
}

function ChatMessages({messages , isLoading}:ChatMessageProps){

    // Helper function to extract text from content
    const getMessageText = (content: string | { message: string }): string => {
        if (typeof content === "string") {
            return content;
        }
        return content.message || "";
    };

    return(
        <div className = "chat-messages">
            {messages.map((message, idx) => (
                <div key={idx} className= { `chat-message-${message.role === "user" ? "user" : "assistant"}` }>
                    { isLoading  && !message.content ?
                        "Loading ..."
                        :message.role === "assistant" ?
                        <>
                        <Markdown>{getMessageText(message.content)}</Markdown>
                        </>
                    : <div>{getMessageText(message.content)}</div>}
                </div>
             ))
            }
        </div>
    )
};

export default ChatMessages;