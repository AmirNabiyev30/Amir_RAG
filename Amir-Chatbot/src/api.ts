//Where our API calls will be made


const API_URL = "http://localhost:8000";

interface APIResponse {
    response:string
    retriever_time:number;
    prompt_time:number;
    sources:string[];
}

async function sendMessage(message:string):Promise<APIResponse> {
    const res  = await fetch(API_URL +'/chat',
        {
            method: "POST",
            //The headers just states that we are sending json data to the backend
            headers:{"Content-Type": "application/json"},
            //the body is the actual message we are sending
            body: JSON.stringify({question:message}),
        }
    )
    if (!res.ok){
        throw new Error("ERROR:COULD NOT CONNECT TO BACKEND")
    }
    const data = await res.json();
    return data;
}


export default sendMessage;