import './ChatCard.css'
import placeHolderImage from "./placeholder_avatar.png"
import {useTheme} from "../../context/ThemeContext.tsx";

function ChatCard() {
    const {theme} = useTheme()
    const formattedTime = new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0");

    return (
        <>
            <div className={theme === "dark" ? "chatCardContainerDark" : "chatCardContainer"}>
                <div className={theme === "dark" ? "chatCardHeaderDark" : "chatCardHeader"}>
                    <div className={theme === "dark" ? "chatCardAvatarContainerDark" : "chatCardAvatarContainer"}>
                        <img src={placeHolderImage} alt={"avatar"} className={"chatCardAvatar"}/>
                    </div>
                    <div className={theme === "dark" ? "chatCardUsernameContainerDark" : "chatCardUsernameContainer"}>
                        <span>Username</span>
                    </div>
                </div>
                <div className={theme === "dark" ? "chatCardMessageContainerDark" : "chatCardMessageContainer"}>
                    <span>This is a test message</span>
                </div>
                <div className={theme === "dark" ? "chatCardTimeContainerDark" : "chatCardTimeContainer"}>
                    <span>{formattedTime}</span>
                </div>
            </div>
        </>
    )
}

export default ChatCard