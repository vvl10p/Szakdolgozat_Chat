import Sidebar from "./assets/chatComponents/Sidebar.tsx";
import ChatWindow from "./assets/chatComponents/ChatWindow.tsx";
import "./Chat.css"
import React from "react";
import {ThemeProvider} from "./context/context.tsx";

class Chat extends React.Component{
    render() {
        return (
            <>
                <ThemeProvider>
                <div className={"chatContainer"}>
                    <div className={"chatSidebarContainer"}>
                        <Sidebar/>
                    </div>
                    <div className={"chatChatWindowContainer"}>
                        <ChatWindow/>
                    </div>
                </div>
                </ThemeProvider>
            </>
        );
    }
}

export default Chat