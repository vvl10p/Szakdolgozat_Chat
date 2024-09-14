import "./ChatWindow.css"
import {useRef, useState} from "react";

function ChatWindow(){

    const [inputText,setInputText] = useState('')

    //const openPicture = null
    const openFileExplorer = useRef(null)
    const onFileButtonClick = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        openFileExplorer.current.click()
    };

    /*const messageSendRequestOptions = {
        method:"POST",
        headers:{"Content-type":"application/json","jwt":localStorage.getItem("jwt")},
        body:JSON.stringify({
            message:inputText
        }
        )}
*/
    return (
        <>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"/>
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
                                <button className={"chatWindowControlButton"} onClick={onFileButtonClick}>
                                    <span className={"material-icons"}>image</span>
                                </button>
                                <input type='file' id='file' ref={openFileExplorer} style={{display: 'none'}}/>
                            </div>
                            <div className={"chatWindowControlFile"}>
                                <button className={"chatWindowControlButton"} onClick={onFileButtonClick}>
                                    <span className={"material-icons"}>attach_file</span>
                                </button>
                                <input type='file' id='file' ref={openFileExplorer} style={{display: 'none'}}/>
                            </div>
                            <div className={"chatWindowControlInput"}>
                                <input className={"chatWindowControlInputField"} onChange={(e)=>(setInputText(e.target.value))} defaultValue={inputText} placeholder={"type your message here!"}></input>
                            </div>
                            <div className={"chatWindowControlSend"}>
                                <button className={"chatWindowControlButton"}>
                                    <span className={"material-icons"}>send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatWindow