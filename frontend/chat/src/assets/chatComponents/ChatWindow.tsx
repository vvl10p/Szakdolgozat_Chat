import "./ChatWindow.css"
import {useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';


function ChatWindow() {

    const searchParams = useSearchParams();
    console.log(searchParams);
    const [inputText, setInputText] = useState('')

    const openFileExplorer = useRef(null)
    const onFileButtonClick = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        openFileExplorer.current.click()
    };

    /*
    const messageGetRequestOptions = {
        method:"GET",
        headers:{"Content-type":"application/json","jwt":localStorage.getItem("jwt")},
        body:JSON.stringify({
            message: ms
        }
        )
    }
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
                                <button className={"chatWindowControlButton"} onClick={onFileButtonClick}>
                                    <ImageIcon/>
                                </button>
                                <input type='file' id='file' ref={openFileExplorer} style={{display: 'none'}}/>
                            </div>
                            <div className={"chatWindowControlFile"}>
                                <button className={"chatWindowControlButton"} onClick={onFileButtonClick}>
                                    <AttachFileIcon/>
                                </button>
                                <input type='file' id='file' ref={openFileExplorer} style={{display: 'none'}}/>
                            </div>
                            <div className={"chatWindowControlInput"}>
                                <input className={"chatWindowControlInputField"}
                                       onChange={(e) => (setInputText(e.target.value))} defaultValue={inputText}
                                       placeholder={"type your message here!"}></input>
                            </div>
                            <div className={"chatWindowControlSend"}>
                                <button className={"chatWindowControlButton"}>
                                    <SendIcon/>
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