import "./MessageBubble.css"

interface MessageBubbleProps {
    message: string | JSX.Element;
}

function MessageBubble(message: MessageBubbleProps) {
    return (
        <>
            <div className={"messageContainer"}>
                <div className={"messageBubble"}>
                    {typeof message.message === "string" ? (
                        <pre className={"messageText"}>{message.message}</pre>
                    ) : (
                        message.message
                    )}
                </div>
            </div>
        </>
    )
}

export default MessageBubble;