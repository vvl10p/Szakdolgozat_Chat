import './ChatCard.css'
import placeHolderImage from "./placeholder_avatar.png"

function ChatCard() {
    const formattedTime = new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0");

    return (
        <>
            <div className={"chatCardContainer"}>
                <div className={"chatCardHeader"}>
                    <div className={"chatCardAvatarContainer"}>
                        <img src={placeHolderImage} alt={"avatar"} className={"chatCardAvatar"}/>
                    </div>
                    <div className={"chatCardUsernameContainer"}>
                        <span>Username</span>
                    </div>
                </div>
                <div className={"chatCardMessageContainer"}>
                    <span>This is a test message</span>
                </div>
                <div className={"chatCardTimeContainer"}>
                    <span>{formattedTime}</span>
                </div>
            </div>
        </>
    )
}

export default ChatCard