import "./ChatWindow.css"
import {useEffect, useRef, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AddIcon from '@mui/icons-material/Add';
import {useChat} from "../../context/ChatContext.tsx";
import {useSearchParams} from "react-router-dom";
import MessageBubble from "./MessageBubble.tsx";
import {Box, Modal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

function ChatWindow() {
    const {theme} = useTheme()
    const {sendMessage, messages} = useChat()

    const [searchParams] = useSearchParams()
    const [inputText, setInputText] = useState<string>('')
    const [, setLineCount] = useState<number>(1)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const sanitizeInput = (text: string) :string => {
        const sanitizedText = text.replace(/^[\s\n\r\t]+|[\s\n\r\t]+$/g, "")
        if (sanitizedText == "") {
            return ''
        }
        return sanitizedText
    }

    const reformatTextarea = ()=> {
        if (textareaRef.current) {
            setInputText("")
            textareaRef.current.value = ""
            setLineCount(1)
            textareaRef.current.style.height = `48px`
            textareaRef.current.style.transform = `translateY(0)`
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && textareaRef.current) {
            if (!e.shiftKey) {
                e.preventDefault()
                const sanitizedText = sanitizeInput(inputText)
                if (sanitizedText !== "") {
                    sendMessage(sanitizedText, searchParams.get("id")!, files,fileData)
                }
                reformatTextarea()
                setFiles([])
                setFileData([])
                setFilePreviews([])
            }
        }
    }

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

    const [files, setFiles] = useState<ArrayBuffer[]>([])
    const [filePreviews, setFilePreviews] = useState<{ preview: React.ReactNode; name: string }[]>([])
    const [fileData, setFileData] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (!selectedFiles) return

        Array.from(selectedFiles).forEach((file) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                if (e.target?.result) {
                    const bytes = e.target.result as ArrayBuffer
                    setFiles((prev) => [...prev, bytes])
                    const fileData = JSON.stringify({ name: file.name, type: file.type })
                    setFileData((prev) => [...prev, fileData])
                    console.log(fileData)

                    if (file.type.startsWith("image")) {
                        const blob = new Blob([bytes], { type: file.type })
                        const url = URL.createObjectURL(blob)
                        setFilePreviews((prev) => [
                            ...prev,
                            { preview: <img className={"chatWindowControlInputPreviewImage"} src={url} alt={file.name}/>, name: file.name },
                        ])
                    } else {
                        setFilePreviews((prev) => [...prev, { preview: <div>{getFilePlaceholderPreview(file.name)}</div>, name: file.name }])
                    }
                }
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const handleFileClick = () => {
        inputRef.current?.click()
    }

    const handleFileRemove = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        setFilePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const getFilePlaceholderPreview = (fileName:string) => {
        const fileExtension = fileName.split('.').pop()?.toLowerCase()
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: "400px",
        minHeight: "400px",
        maxWidth: "auto",
        bgcolor: '#555',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    const [open, setOpen] = useState(false)
    const handleOpen = (image:string) => {
        setModalData(image)
        setOpen(true)
    }
    const handleClose = () => setOpen(false)
    const [modalData, setModalData] = useState<string | null>(null)

    const downloadImage = () => {
        if (!modalData) return
        const link = document.createElement("a")
        link.href = modalData
        link.download = modalData.split("/").pop()!
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                        {messages.length > 0 ? (
                            <div>
                                {messages.filter((message) => message.ConversationID == searchParams.get("id"))
                                    .map((message, index) => {
                                        const content = message.Content
                                        const hasExtension = content.includes(".")
                                        const extension = hasExtension ? content.split(".").pop()!.toLowerCase() : ""

                                        let renderedContent

                                        if (
                                            extension === "jpg" || extension === "jpeg" || extension === "png" ||
                                            extension === "gif" || extension === "webp" || extension === "heic" || extension === "heif"
                                        ) {
                                            renderedContent = (
                                                <img src={content} alt="Image" className="chatWindowImagePreview" onClick={() => handleOpen(content)}
                                                     style={{ cursor: "pointer" }}/>
                                            )
                                        } else if (
                                            extension === "mp4" || extension === "webm" || extension === "ogg" ||
                                            extension === "mov" || extension === "3gp" || extension === "mkv"
                                        ) {
                                            renderedContent = (
                                                <video controls className="chatWindowMediaVideo">
                                                    <source src={content} type={`video/${extension}`} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )
                                        } else if (hasExtension) {
                                            renderedContent = (
                                                <div onClick={() => window.open(content, "_blank")}
                                                     style={{ cursor: "pointer"}}>
                                                    {getFilePlaceholderPreview(content)}
                                                </div>
                                            )
                                        } else {
                                            renderedContent = content
                                        }

                                        return (
                                            <div key={index}>
                                                <MessageBubble key={index} message={renderedContent} />
                                            </div>
                                        )
                                    })}
                            </div>
                        ) : (
                            <div>No messages yet.</div>
                        )}
                    </div>
                    <div className={theme === "dark" ? "chatWindowControlContainerDark" : "chatWindowControlContainer"}>
                        <div className={theme === "dark" ? "chatWindowControlInputContainerDark" : "chatWindowControlInputContainer"}>
                            <div className={theme === "dark" ? "chatWindowControlFileDark" : "chatWindowControlFile"}>
                                <button
                                    className={theme === "dark" ? "chatWindowControlButtonDark" : "chatWindowControlButton"}
                                    onClick={handleFileClick}>
                                    <AddIcon/>
                                </button>
                                <input type='file' accept={""} ref={inputRef} onChange={handleFileChange}
                                       style={{display: 'none'}}/>
                            </div>
                            <div className={theme === "dark" ? "chatWindowControlInputDark" : "chatWindowControlInput"}>
                                <div className={theme === "dark" ? "chatWindowControlInputPreviewContainerDark" : "chatWindowControlInputPreviewContainer"}>
                                    {files && files.length > 0 && filePreviews.map((file, index) => (
                                        <div key={file.name}
                                            className={theme === "dark" ? "chatWindowControlInputFileContainerDark" : "chatWindowControlInputFileContainer"}>
                                            <div
                                                className={theme === "dark" ? "chatWindowControlInputPreviewFileDark" : "chatWindowControlInputPreviewFile"}>
                                                {file.preview}
                                                <p>{file.name}</p>
                                            </div>
                                            <button
                                                className={theme === "dark" ? "chatWindowControlInputPreviewImageRemoveDark" : "chatWindowControlInputPreviewImageRemove"}
                                                onClick={()=>handleFileRemove(index)}>
                                                <CancelIcon/>
                                            </button>
                                        </div>
                                        )
                                    )}
                                </div>
                                <textarea
                                    className={theme === "dark" ? "chatWindowControlInputFieldDark" : "chatWindowControlInputField"}
                                    onChange={handleTextChange} defaultValue={inputText}
                                    placeholder={"type your message here!"} rows={1} ref={textareaRef} onKeyDown={(ev) => handleKeyDown(ev)}>
                                </textarea>
                            </div>
                            <div className={theme === "dark" ? "chatWindowControlSendDark" : "chatWindowControlSend"}
                                 onClick={() => {
                                     const sanitizedText = sanitizeInput(inputText)
                                     if (sanitizedText !== "") {
                                         sendMessage(sanitizedText, searchParams.get("id")!, files, fileData)
                                         reformatTextarea()
                                         setFiles([])
                                         setFileData([])
                                         setFilePreviews([])
                                     } else {
                                         reformatTextarea()
                                         setFiles([])
                                         setFileData([])
                                         setFilePreviews([])
                                     }
                                 }}>
                                <button
                                    className={theme === "dark" ? "chatWindowControlButtonDark" : "chatWindowControlButton"}>
                                    <SendIcon/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {open && modalData && (
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <div className={"chatWindowModalContainer"}>
                                <div className={"chatWindowModalActionContainer"}>
                                    <button className={"chatWindowModalAction"} onClick={downloadImage}>
                                        <DownloadIcon/>
                                    </button>
                                    <button className={"chatWindowModalAction"} onClick={handleClose}>
                                        <CloseIcon/>
                                    </button>
                                </div>
                                <div className={"chatWindowModalImageContainer"}>
                                    <img src={modalData}></img>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                )}
            </div>
        </>
    )
}

export default ChatWindow