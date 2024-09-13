import Sidebar from "./assets/chatComponents/Sidebar.tsx";
import ChatWindow from "./assets/chatComponents/ChatWindow.tsx";
import "./Chat.css"
import React from "react";

class Chat extends React.Component{
    render() {
        return (
            <>
                <div className={"chatContainer"}>
                    <div className={"chatSidebarContainer"}>
                        <Sidebar/>
                    </div>
                    <div className={"chatChatWindowContainer"}>
                        <ChatWindow/>
                    </div>
                </div>
            </>
        );
    }
}

export default Chat