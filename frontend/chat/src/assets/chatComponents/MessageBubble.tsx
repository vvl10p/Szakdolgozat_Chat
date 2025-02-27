import "./MessageBubble.css"

interface MessageBubbleProps {
    message: string;
}

function MessageBubble(message: MessageBubbleProps) {
    return (
        <>
            <div className={"messageContainer"}>
                <div className={"messageBubble"}>
                    <pre className={"messageText"}>{message.message}</pre>
                </div>
            </div>
        </>
    )
}

export default MessageBubble;