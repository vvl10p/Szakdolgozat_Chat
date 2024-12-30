import React, {useContext, useEffect, useRef} from "react";
import {useUser} from "./UserContext.tsx";

interface ChatContext {
    sessions: string[]
    setSessions: React.Dispatch<React.SetStateAction<string[]>>
}

const ChatContext = React.createContext<ChatContext>({sessions: [], setSessions: ()=>{}})

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChat must be used within the context")
    }
    return context
}

export const ChatProvider = ({children}: {children: React.ReactNode}) => {
    const [sessions, setSessions] = React.useState<string[]>([])
    const socket = useRef<WebSocket>()
    const {user} = useUser()

    useEffect(() =>{
        if (!user && socket.current) {
            socket.current?.close()
            socket.current = undefined
        }
        if (user) {
            socket.current = new WebSocket("ws://localhost:4000")
            if (socket.current) {
                socket.current.onopen = () =>{
                    console.log("WebSocket connection established")
                    socket.current?.send(JSON.stringify({name: "connect", data: "asd"}))
                }
                socket.current?.addEventListener("message",(e) => {console.log(e.data)})
            }
        }
    },[user])

    return (
        <ChatContext.Provider value={{sessions, setSessions}}>
            {children}
        </ChatContext.Provider>
    )
}


