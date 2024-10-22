import "./Sidebar.css"
import ChatCard from "./ChatCard.tsx";
import {useNavigate} from "react-router-dom";
import placeHolderImage from "./placeholder_avatar.png"
import SettingsIcon from '@mui/icons-material/Settings';
import {useTheme} from "../../context/Context.tsx";
import GroupsIcon from "@mui/icons-material/Groups";
import {Box, Modal} from "@mui/material";
import {useEffect, useState} from "react";
import FriendList from "../friendComponents/FriendList.tsx";
import {GetUserData as GetUserDataAPI} from "../../API/user.ts";
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar() {

    const {theme} = useTheme()

    const navigate = useNavigate()

    function mapChats() {
        return (
            <>
                <div className={"sidebarContent"} onClick={() => {
                    navigate(location.pathname + "?id=1")
                }}>
                    <ChatCard/>
                </div>
            </>
        )
    }

    interface userData {
        username: string
        avatarPath: string
    }

    const [userData, setUserData] = useState<userData | null>(null)

    useEffect(() => {
        async function getUserData() {
            const token = localStorage.getItem("jwt")
            if (token) {
                try {
                    const data = await GetUserDataAPI(token)
                    setUserData(data)
                } catch (error) {
                    return
                }
            }
        }

        getUserData()

    }, [])

    const avatarSrc = userData?.avatarPath ? userData.avatarPath : placeHolderImage

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 600,
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
                    <div className={theme === "dark" ? "sidebarContentDark" : "sidebarContent"}>
                        {mapChats()}
                    </div>
                </div>
                <div className={theme === "dark" ? "sidebarFooterDark" : "sidebarFooter"}>
                    {/*<div
                        className={theme === "dark" ? "sidebarContentDark sidebarButtonDark" : "sidebarContent sidebarButton"}
                        onClick={() => {
                            navigate("/settings")
                        }}>
                        <SettingsIcon className={"sidebarSettingsIcon"}/>
                        <span
                            className={theme === "dark" ? "sidebarSettingsTextDark" : "sidebarSettingsText"}>Settings</span>
                    </div>
                        <span>ChatApp</span>*/}
                    <div className={"sidebarUserContainer"}>
                        <div className={"sidebarUserAvatarContainer"}>
                            <img className={"sidebarUserAvatar"} src={avatarSrc}
                                 alt={`${userData?.username}'s avatar`}/>
                        </div>
                        <div className={"sidebarUserNameActionContainer"}>
                            <div className={"sidebarUsernameContainer"}>
                                <span className={"sidebarUsername"}>{userData?.username}</span>
                            </div>
                            <div className={"sidebarUserActionContainer"}>
                                <div className={"sidebarButton"} onClick={() => navigate("/settings")}>
                                    <span className={"sidebarUserAction sidebarSettingsIcon"}
                                          ><SettingsIcon/></span>
                                </div>
                                <div className={"sidebarButton"} onClick={handleOpenFriend}>
                                    <span className={"sidebarUserAction"}
                                          ><GroupsIcon/></span>
                                </div>
                                <Modal
                                    open={openFriend}
                                    onClose={handleCloseFriend}
                                >
                                    <Box sx={style}>
                                        <span className={"sidebarFriendModalClose"} onClick={handleCloseFriend}><CloseIcon/></span>
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
