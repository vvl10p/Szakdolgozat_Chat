import React, {useContext, useEffect, useRef, useState} from "react";
import {useUser} from "./UserContext.tsx";

interface ChatContext {
    socket: React.RefObject<WebSocket | null>
    sendMessage: (message: string, chatId: string, file: ArrayBuffer[], fileData: string[]) => void
    messages: ReceivedMessage[]
    setMessages: (messages: ReceivedMessage[]) => void
}

type Message = {
    Event: string
    ChatID: string
    Sender: string
    Content: string
    File: number[]
}

type ReceivedMessage = {
    MsgID: string
    ConversationID: string
    Content: string
    Sender: string
    Timestamp: string
    SeenBy: string
}

const ChatContext = React.createContext<ChatContext | null>(null)

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChat must be used within the context")
    }
    return context
}

export const ChatProvider = ({children}: { children: React.ReactNode }) => {
    const socket = useRef<WebSocket | null>(null)
    const {user} = useUser()
    //const [searchParams] = useSearchParams()
    const [messages, setMessages] = useState<ReceivedMessage[]>([])

    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5

    const handleMessage = (ev: MessageEvent) => {
        const incomingMessage = JSON.parse(ev.data)
        if (incomingMessage.Content !== "") {
            if (/^[\n\r\t]+$/.test(incomingMessage.Content.trim())) {
                return
            }
            console.log("Message from WebSocket:", incomingMessage)
            setMessages((prevMessages) => [...prevMessages, {...incomingMessage}])
        }
    }

    useEffect(() => {
        if (!user) {
            if (socket.current) {
                socket.current.close()
                socket.current = null
            }
            return
        }

        if (!socket.current || socket.current?.readyState === WebSocket.CLOSED) {

            socket.current = new WebSocket("wss://"+import.meta.env.VITE_BACKEND_URL.replace("https://","")+`/ws?userID=${user.id}`)

            socket.current.onerror = (ev) => {
                console.error("WebSocket error:", ev)
            }

            socket.current.onclose = (ev) => {
                console.error("WebSocket closed:", ev)
                if (ev.code !== 1000 && ev.code !== 1006 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++
                    setTimeout(reconnectWebSocket, 3000)
                }
            }

            socket.current.onopen = () => {
                console.log("WebSocket connection established")
                reconnectAttempts.current = 0
            }

            socket.current.onmessage = handleMessage
        }

        return () => {
            if (socket.current) {
                socket.current.close()
            }
        }
    }, [user])

    const sendMessage = (message: string, chatId: string, file:ArrayBuffer[], fileData: string[]) => {
        if (socket.current?.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not open. Message not sent.")
            return
        }

        if (file.length > 0) {
            file.map((file: ArrayBuffer, index: number)=> {
                const msg: Message = {
                    Event: "FileUpload",
                    ChatID: chatId,
                    Sender: String(user?.id),
                    Content: fileData[index],
                    File: Array.from(new Uint8Array(file)),
                }
                socket.current?.send(JSON.stringify(msg))
            })
        }

        const msg: Message = {
            Event: "write",
            ChatID: chatId,
            Sender: String(user?.id),
            Content: message,
            File: [],
        }

        socket.current?.send(JSON.stringify(msg))
    }

    const reconnectWebSocket = () => {
        console.log("Attempting to reconnect...");
        if (user) {
            socket.current = new WebSocket("wss://"+import.meta.env.VITE_BACKEND_URL.replace("https://","")+`/ws?userID=${user.id}`)

            socket.current.onerror = (ev) => {
                console.error("WebSocket error:", ev)
            };

            socket.current.onclose = (ev) => {
                console.error("WebSocket closed:", ev)
                if (ev.code !== 1000 && ev.code !== 1006 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++
                    setTimeout(reconnectWebSocket, 3000)
                }
            };

            socket.current.onopen = () => {
                console.log("WebSocket connection established")
                reconnectAttempts.current = 0
            };

            socket.current.onmessage = (e) => {
                console.log("Message received:", e.data)
            };
        }
    }

    return (
        <ChatContext.Provider value={{socket, sendMessage, messages, setMessages}}>
            {children}
        </ChatContext.Provider>
    )
}


