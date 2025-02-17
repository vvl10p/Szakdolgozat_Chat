import "./MessageBubble.css"

interface MessageBubbleProps {
    message: string;
}

function MessageBubble(message: MessageBubbleProps) {
    return (
        <>
            <div className={"messageContainer"}>
                <div className={"messageBubble"}>
                    <span className={"messageText"}>{message.message}</span>
                </div>
            </div>
        </>
    )
}

export default MessageBubble;