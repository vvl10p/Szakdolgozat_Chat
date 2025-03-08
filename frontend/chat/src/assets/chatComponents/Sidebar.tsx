import "./Sidebar.css"
import ChatCard from "./ChatCard.tsx";
import {useNavigate} from "react-router-dom";
import placeHolderImage from "./placeholder_avatar.png"
import SettingsIcon from '@mui/icons-material/Settings';
import {useTheme} from "../../context/ThemeContext.tsx";
import GroupsIcon from "@mui/icons-material/Groups";
import {Box, Modal} from "@mui/material";
import {useEffect, useState} from "react";
import FriendList from "../friendComponents/FriendList.tsx";
import CloseIcon from '@mui/icons-material/Close';
import {useUser} from "../../context/UserContext.tsx";
import {FriendsForSidebar as FriendsForSidebarAPI} from "../../API/friendlist.ts";
import {useChat} from "../../context/ChatContext.tsx";
import {getMessages} from "../../API/chat.ts";

type SideBarPreview = {
    id: string,
    avatarPath: string,
    username: string,
    lastMessage: string,
    lastMessageTimeStamp: string,
    chatId: string,
}

type ReceivedMessage = {
    MsgID: string
    ConversationID: string
    Content: string
    Sender: string
    Timestamp: string
    SeenBy: string
}

type LastMessage = {
    LastMessage: string,
    LastMessageTimeStamp: string,
}

export default function Sidebar() {
    const {theme} = useTheme()
    const {messages, setMessages} = useChat()
    const [friends, setFriends] = useState<SideBarPreview[]>([])
    const [lastMessages, setLastMessages] = useState<Map<string, LastMessage>>()


    const navigate = useNavigate()

    const formatTime = (time: string) => {
        const date = new Date(time)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        console.log(time)
        console.log(`${hours}:${minutes}`)
        return `${hours}:${minutes}`
    }

    async function handleFriends() {
        const token = localStorage.getItem("jwt")
        if (token) {
            try {
                return await FriendsForSidebarAPI(token)
            } catch (error) {
                console.log(error)
                return
            }
        }
    }

    useEffect(() => {
        if (!messages) return
        const temp = messages.at(-1)
        if (!temp) return

        setLastMessages((prevState) => {
            const newMap = new Map(prevState ?? new Map<string, LastMessage>())
            newMap.set(String(temp.ConversationID), {
                LastMessage: temp.Content,
                LastMessageTimeStamp: formatTime(temp.Timestamp),
            })
            return newMap
        })
    }, [messages])

    useEffect(() => {
        const fetchMessagesForFriends = async () => {
            try {
                const data:SideBarPreview[] = await handleFriends()
                setFriends(data)

                const allMessages: ReceivedMessage[] = []
                const allLastMessages: Map<string, LastMessage> = new Map()

                await Promise.all(
                    data.map(async (friend) => {
                        const msgs = await getMessages(friend.chatId, localStorage.getItem("jwt")!)

                        if (!msgs) {
                            return
                        }

                        const messagesToDisplay: ReceivedMessage[] = msgs.map((msg:ReceivedMessage) => ({
                            MsgId: msg.MsgID,
                            Sender: msg.Sender,
                            Content: msg.Content,
                            Timestamp: msg.Timestamp,
                            ConversationID: msg.ConversationID,
                            SeenBy: msg.SeenBy,
                        }))

                        allMessages.push(...messagesToDisplay)
                        const temp = messagesToDisplay.at(-1)
                        if (!temp) return
                        allLastMessages.set(friend.chatId, {
                            LastMessage: temp.Content,
                            LastMessageTimeStamp: formatTime(temp.Timestamp),
                        })
                    })
                )

                setMessages(allMessages)

                setLastMessages(allLastMessages)

            } catch (error) {
                console.error(error)
            }
        }
        fetchMessagesForFriends()
    }, [])

    const {user} = useUser()

    const avatarSrc = user?.avatarPath ? user.avatarPath : placeHolderImage

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30vw",
        height: "50vh",
        borderRadius: 5,
        boxShadow: 24,
        backgroundColor: "#333",
        p: 4,
        outline: 0,
    }

    const [openFriend, setOpenFriend] = useState<boolean>(false)
    const handleOpenFriend = () => setOpenFriend(true)
    const handleCloseFriend = () => setOpenFriend(false)

    return (
        <>
            <div className={theme === "dark" ? "sidebarContainerDark" : "sidebarContainer"}>
                <div className={theme === "dark" ? "sidebarHeaderDark" : "sidebarHeader"}>
                    <span>Messages</span>
                </div>
                <div className={theme === "dark" ? "sidebarContentContainerDark" : "sidebarContentContainer"}>
                    {
                        lastMessages && lastMessages.size > 0 && friends && friends.map((friend, index) => {
                            return (
                            <div key={index} className={"sidebarContent"} tabIndex={1} onClick={() => {
                                navigate(`${location.pathname}?id=${friend.chatId}`)
                            }}>
                                <ChatCard friend={friend} lastMessage={lastMessages!.get(friend.chatId)!.LastMessage}
                                          lastMessageTimestamp={lastMessages!.get(friend.chatId)!.LastMessageTimeStamp}/>
                            </div>
                        )})}
                </div>
                <div className={theme === "dark" ? "sidebarFooterDark" : "sidebarFooter"}>
                    <div className={theme === "dark" ? "sidebarUserContainerDark" : "sidebarUserContainer"}>
                        <div
                            className={theme === "dark" ? "sidebarUserAvatarContainerDark" : "sidebarUserAvatarContainer"}>
                            <img className={theme === "dark" ? "sidebarUserAvatarDark" : "sidebarUserAvatar"}
                                 src={avatarSrc}
                                 alt={`${user?.username}'s avatar`}/>
                        </div>
                        <div
                            className={theme === "dark" ? "sidebarUserNameActionContainerDark" : "sidebarUserNameActionContainer"}>
                            <div
                                className={theme === "dark" ? "sidebarUsernameContainerDark" : "sidebarUsernameContainer"}>
                                <span
                                    className={theme === "dark" ? "sidebarUsernameDark" : "sidebarUsername"}>{user?.username}</span>
                            </div>
                            <div
                                className={theme === "dark" ? "sidebarUserActionContainerDark" : "sidebarUserActionContainer"}>
                                <div className={theme === "dark" ? "sidebarButtonDark" : "sidebarButton"} tabIndex={1}
                                     onClick={() => navigate("/settings")}>
                                    <span className={"sidebarUserAction sidebarSettingsIcon"}
                                    ><SettingsIcon/></span>
                                </div>
                                <div className={theme === "dark" ? "sidebarButtonDark" : "sidebarButton"} tabIndex={1}
                                     onClick={handleOpenFriend}>
                                    <span className={theme === "dark" ? "sidebarUserActionDark" : "sidebarUserAction"}
                                    ><GroupsIcon/></span>
                                </div>
                                <Modal
                                    open={openFriend}
                                    onClose={handleCloseFriend}
                                >
                                    <Box sx={style}>
                                        <span
                                            className={theme === "dark" ? "sidebarFriendModalCloseDark" : "sidebarFriendModalClose"}
                                            onClick={handleCloseFriend}><CloseIcon/></span>
                                        <FriendList/>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
