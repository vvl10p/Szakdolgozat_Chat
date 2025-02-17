import React, {useContext, useEffect, useRef, useState} from "react";
import {useUser} from "./UserContext.tsx";

interface ChatContext {
    socket: React.RefObject<WebSocket | null>
    sessions: string[]
    setSessions: React.Dispatch<React.SetStateAction<string[]>>
    sendMessage: (message: string, chatId: string) => void
}

type Message = {
    Event: string
    ChatID: string
    Sender: string
    Content: string
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

    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5

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

            socket.current.onmessage = (e) => {
                console.log("Message received:", e.data)
            }
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
        <ChatContext.Provider value={{socket, sessions, setSessions, sendMessage}}>
            {children}
        </ChatContext.Provider>
    )
}


