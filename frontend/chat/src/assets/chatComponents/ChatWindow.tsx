import "./ChatWindow.css"
//import {useState} from "react";

function ChatWindow(){

    /*const [inputText,setInputText] = useState('')
    const messageSendRequestOptions = {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            message:inputText
        }
        )}
*/
    return (
        <>
            <div className={"chatWindowContainer"}>
                <div className={"chatWindowContent"}>
                    <div className={"chatWindowHeaderContainer"}>
                        <h1>Header</h1>
                    </div>
                    <div className={"chatWindowMessageHistoryContainer"}>
                        <p>messages</p>
                    </div>
                    <div className={"chatWindowControlContainer"}>
                        <div className={"chatWindowControlInputContainer"}>
                            <div className={"chatWindowControlPicture"}>

                            </div>
                            <div className={"chatWindowControlFile"}>

                            </div>
                            <div className={"chatWindowControlInput"}>
                                <input /*onChange={(e) => setInputText(e.target.value)}*/ placeholder={"Type your message here!"}></input>
                            </div>
                            <div className={"chatWindowControlSend"}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatWindow