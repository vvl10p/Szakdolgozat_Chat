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

type SideBarPreview = {
    id: string,
    avatarPath: string,
    username: string,
    lastMessage: string,
    lastMessageTimeStamp: string,
    chatId: string,
}

export default function Sidebar() {
    const {theme} = useTheme()
    const [friends, setFriends] = useState<SideBarPreview[]>([])

    const navigate = useNavigate()

    async function handleFriends() {
        const token = localStorage.getItem("jwt")
        if (token) {
            try {
                const data = await FriendsForSidebarAPI(token)
                setFriends(data)
            } catch (error) {
                console.log(error)
                return
            }
        }
    }

    useEffect(() => {
        handleFriends()
    }, [])

    function mapChats() {
        return (
            <>
                {friends.map((friend, index) => (
                    <div key={index} className={"sidebarContent"} tabIndex={1} onClick={() => {
                        navigate(`${location.pathname}?id=${friend.chatId}`)
                    }}>
                        <ChatCard friend={friend}/>
                    </div>
                ))}
            </>
        )
    }

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
                    {mapChats()}
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
