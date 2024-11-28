import './ChatCard.css'
import {useTheme} from "../../context/ThemeContext.tsx";
import placeHolderAvatar from "./placeholder_avatar.png";

interface ChatCardProps {
    friend?: any
}

function ChatCard({friend}: ChatCardProps) {
    const {theme} = useTheme()
    const formattedTime = new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0");

    return (
        <>
            <div className={theme === "dark" ? "chatCardContainerDark" : "chatCardContainer"}>
                <div className={theme === "dark" ? "chatCardHeaderDark" : "chatCardHeader"}>
                    <div className={theme === "dark" ? "chatCardAvatarContainerDark" : "chatCardAvatarContainer"}>
                        <img
                            className="friendListAvatar"
                            src={friend.avatarPath || placeHolderAvatar}
                            alt={`${friend.username}'s avatar`}
                        />
                    </div>
                    <div className={theme === "dark" ? "chatCardUsernameContainerDark" : "chatCardUsernameContainer"}>
                        <span>{friend.username}</span>
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