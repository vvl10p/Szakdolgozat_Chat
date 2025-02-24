import React, {useContext, useEffect, useRef, useState} from "react";
import {useUser} from "./UserContext.tsx";
import {getMessages} from "../API/chat.ts";
import {useSearchParams} from "react-router-dom";

interface ChatContext {
    socket: React.RefObject<WebSocket | null>
    sessions: string[]
    setSessions: React.Dispatch<React.SetStateAction<string[]>>
    sendMessage: (message: string, chatId: string) => void
    messages: ReceivedMessage[]
}

type Message = {
    Event: string
    ChatID: string
    Sender: string
    Content: string
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
    const [sessions, setSessions] = useState<string[]>([])
    const socket = useRef<WebSocket | null>(null)
    const {user} = useUser()
    const [searchParams] = useSearchParams()
    const [messages, setMessages] = useState<ReceivedMessage[]>([])

    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5

    const handleMessage = (ev: MessageEvent) => {
        const incomingMessage = JSON.parse(ev.data)
        console.log("Message from WebSocket:", incomingMessage)
        setMessages((prevMessages) => [...prevMessages, { ...incomingMessage }])
    }

    useEffect( () => {
        const fetchMessages = async () => {
            console.log(searchParams.get("id"))
            try {
                const msgs = await getMessages(searchParams.get("id")!, localStorage.getItem("jwt")!)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const messagesToDisplay: ReceivedMessage[] = msgs.map((msg) => ({
                    MsgId: msg.MsgID,
                    Sender: msg.Sender,
                    Content: msg.Content,
                    Timestamp: msg.Timestamp,
                    ConversationID: msg.ConversationID,
                    SeenBy: msg.SeenBy,
                }))
                setMessages(messagesToDisplay)
                console.log(messages)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchMessages()
    }, [searchParams]);

    useEffect(() => {
        if (!user) {
            if (socket.current) {
                socket.current.close()
                socket.current = null
            }
            return
        }

        if (!socket.current || socket.current?.readyState === WebSocket.CLOSED) {

            socket.current = new WebSocket(`ws://localhost:5175/ws?userID=${user.id}`)

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

    const sendMessage = (message: string, chatId: string) => {
        if (socket.current?.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not open. Message not sent.")
            return
        }

        const msg: Message = {
            Event: "write",
            ChatID: chatId,
            Sender: String(user?.id),
            Content: message,
        }

        socket.current?.send(JSON.stringify(msg))
    }

    const reconnectWebSocket = () => {
        console.log("Attempting to reconnect...");
        if (user) {
            socket.current = new WebSocket(`ws://localhost:5175/ws?userID=${user.id}`)

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
        <ChatContext.Provider value={{socket, sessions, setSessions, sendMessage, messages}}>
            {children}
        </ChatContext.Provider>
    )
}


