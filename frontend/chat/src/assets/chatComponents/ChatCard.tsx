import './ChatCard.css'
import {useTheme} from "../../context/ThemeContext.tsx";
import placeHolderAvatar from "./placeholder_avatar.png";

interface ChatCardProps {
    friend?: any
    lastMessage: string
    lastMessageTimestamp: string
}

function ChatCard({friend, lastMessage, lastMessageTimestamp}: ChatCardProps) {
    const {theme} = useTheme()

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
                    <span>{lastMessage}</span>
                </div>
                <div className={theme === "dark" ? "chatCardTimeContainerDark" : "chatCardTimeContainer"}>
                    <span>{lastMessageTimestamp}</span>
                </div>
            </div>
        </>
    )
}

export default ChatCard