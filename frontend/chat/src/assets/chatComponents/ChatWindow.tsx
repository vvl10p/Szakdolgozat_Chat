import "./ChatWindow.css"
import {useEffect, useRef, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {useChat} from "../../context/ChatContext.tsx";
import {useSearchParams} from "react-router-dom";
import MessageBubble from "./MessageBubble.tsx";

interface Message {
    event: string;
    chatId: string;
    sender: string;
    content: string;
}

function ChatWindow() {
    const {theme} = useTheme()
    const {socket, sendMessage} = useChat()
    const [messages, setMessages] = useState<Message[]>([])

    const [searchParams, _] = useSearchParams()
    const [inputText, setInputText] = useState<string>('')
    const [, setLineCount] = useState<number>(1)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const chatContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = chatContainerRef.current
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            const maxHeight = 4 * 24
            if (textareaRef.current.scrollHeight > maxHeight) {
                textareaRef.current.style.height = `${maxHeight}px`
                textareaRef.current.style.overflowY = "scroll"
            } else {
                textareaRef.current.style.overflowY = "hidden"
            }
            const currentLineCount = Math.floor(textareaRef.current.scrollHeight / 30)
            setLineCount(currentLineCount)
            const offset = Math.min((currentLineCount - 1) * 12, 3 * 8)
            textareaRef.current.style.transform = `translateY(-${offset}px)`
        }

    }

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(event.target.value)
        adjustHeight()
    }

    useEffect(() => {
        adjustHeight()
    }, [])

    const [image, setImage] = useState<string | null>(null)
    const inputImageRef = useRef<HTMLInputElement | null>(null)
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageClick = () => {
        if (inputImageRef.current) {
            inputImageRef.current.click()
        }
    }

    const handleImageRemove = () => {
        setImage(null)
    }

    const [file, setFile] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [filePreview, setFilePreview] = useState<React.ReactNode | null>(null)
    const inputFileRef = useRef<HTMLInputElement | null>(null)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader
            reader.onloadend = () => {
                setFile(reader.result as string)
                setFileName(file.name)
                setFilePreview(getFilePlaceholderPreview(file))
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (socket.current) {
            const handleMessage = (ev: MessageEvent) => {
                const incomingMessage = JSON.parse(ev.data)
                console.log("Message from WebSocket:", incomingMessage)

                setMessages((prevMessages) => [...prevMessages, incomingMessage])
            }

            socket.current.onmessage = handleMessage

            return () => {
                socket.current!.onmessage = handleMessage
            }
        }
    }, [socket.current])

    const handleFileClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click()
        }
    }

    const handleFileRemove = () => {
        setFile(null)
        setFileName(null)
    }

    const getFilePlaceholderPreview = (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        switch (fileExtension) {
            case "pdf":
                return <PictureAsPdfIcon sx={{fontSize: 100}}/>
            case "doc":
            case "docx":
            case "txt":
                return <InsertDriveFileIcon sx={{fontSize: 100}}/>
            case "xlsx":
            case "xlsm":
            case "xls":
                return <BackupTableIcon sx={{fontSize: 100}}/>
            case "ppt":
            case "pptx":
                return <SlideshowIcon sx={{fontSize: 100}}/>
            case "mp4":
            case "avi":
                return <VideoFileIcon sx={{fontSize: 100}}/>
            case "mp3":
            case "wav":
                return <AudioFileIcon sx={{fontSize: 100}}/>
            case "zip":
            case "rar":
                return <FolderZipIcon sx={{fontSize: 100}}/>
            default:
                return <HelpCenterIcon sx={{fontSize: 100}}/>
        }
    }

    return (
        <>
            <div className={theme === "dark" ? "chatWindowContainerDark" : "chatWindowContainer"}>
                <div className={theme === "dark" ? "chatWindowContentDark" : "chatWindowContent"}>
                    <div className={theme === "dark" ? "chatWindowHeaderContainerDark" : "chatWindowHeaderContainer"}>
                        <h1>Header</h1>
                    </div>
                    <div
                        className={theme === "dark" ? "chatWindowMessageHistoryContainerDark" : "chatWindowMessageHistoryContainer"}
                        ref={chatContainerRef}>
                        <h3>Chat Messages:</h3>
                        {messages.length > 0 ? (
                            <div>
                                {messages.filter((message) => message.chatId == searchParams.get("id")).map((message, index) => (
                                    <div key={index}>
                                        <MessageBubble key={index} message={message.content}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No messages yet.</div>
                        )}
                    </div>
                    <div className={theme === "dark" ? "chatWindowControlContainerDark" : "chatWindowControlContainer"}>
                        <div
                            className={theme === "dark" ? "chatWindowControlInputContainerDark" : "chatWindowControlInputContainer"}>
                            <div
                                className={theme === "dark" ? "chatWindowControlPictureDark" : "chatWindowControlPicture"}>
                                <button
                                    className={theme === "dark" ? "chatWindowControlButtonDark" : "chatWindowControlButton"}
                                    onClick={handleImageClick}>
                                    <ImageIcon/>
                                </button>
                                <input type='file' accept={"image/*"} ref={inputImageRef} style={{display: 'none'}}
                                       onChange={handleImageChange}/>
                            </div>
                            <div className={theme === "dark" ? "chatWindowControlFileDark" : "chatWindowControlFile"}>
                                <button
                                    className={theme === "dark" ? "chatWindowControlButtonDark" : "chatWindowControlButton"}
                                    onClick={handleFileClick}>
                                    <AttachFileIcon/>
                                </button>
                                <input type='file' accept={""} ref={inputFileRef} onChange={handleFileChange}
                                       style={{display: 'none'}}/>
                            </div>
                            <div className={theme === "dark" ? "chatWindowControlInputDark" : "chatWindowControlInput"}>
                                <div
                                    className={theme === "dark" ? "chatWindowControlInputPreviewContainerDark" : "chatWindowControlInputPreviewContainer"}>
                                    {image && (
                                        <div
                                            className={theme === "dark" ? "chatWindowControlInputImageContainerDark" : "chatWindowControlInputImageContainer"}>
                                            <img src={image} alt={"ChatImagePreview"}
                                                 className={theme === "dark" ? "chatWindowControlInputPreviewImageDark" : "chatWindowControlInputPreviewImage"}/>
                                            <button
                                                className={theme === "dark" ? "chatWindowControlInputPreviewImageRemoveDark" : "chatWindowControlInputPreviewImageRemove"}
                                                onClick={handleImageRemove}>
                                                <CancelIcon/>
                                            </button>
                                        </div>
                                    )}
                                    {file && (
                                        <div
                                            className={theme === "dark" ? "chatWindowControlInputFileContainerDark" : "chatWindowControlInputFileContainer"}>
                                            <div
                                                className={theme === "dark" ? "chatWindowControlInputPreviewFileDark" : "chatWindowControlInputPreviewFile"}>
                                                {filePreview}
                                                <p>{fileName}</p>
                                            </div>
                                            <button
                                                className={theme === "dark" ? "chatWindowControlInputPreviewImageRemoveDark" : "chatWindowControlInputPreviewImageRemove"}
                                                onClick={handleFileRemove}>
                                                <CancelIcon/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    className={theme === "dark" ? "chatWindowControlInputFieldDark" : "chatWindowControlInputField"}
                                    onChange={handleTextChange} defaultValue={inputText}
                                    placeholder={"type your message here!"} rows={1} ref={textareaRef}>
                                </textarea>
                            </div>
                            <div className={theme === "dark" ? "chatWindowControlSendDark" : "chatWindowControlSend"}
                                 onClick={() => sendMessage(inputText, searchParams.get("id")!)}>
                                <button
                                    className={theme === "dark" ? "chatWindowControlButtonDark" : "chatWindowControlButton"}>
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