import "./ChatWindow.css"

function ChatWindow(){
    return (
        <>
            <div className={"chatContainer"}>
                <div className={"chatContent"}>
                    <div className={"chatHeaderContainer"}>
                        <h1>Header</h1>
                    </div>
                    <div className={"chatMessageHistoryContainer"}>
                        <p>messages</p>
                    </div>
                    <div className={"chatControlContainer"}>
                        <p>inputs</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatWindow