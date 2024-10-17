import "./Sidebar.css"
import ChatCard from "./ChatCard.tsx";
import {useNavigate} from "react-router-dom";
import placeHolderImage from "./placeholder_avatar.png"
import SettingsIcon from '@mui/icons-material/Settings';
import {useTheme} from "../../context/Context.tsx";
import GroupsIcon from "@mui/icons-material/Groups";
import {Box, Modal} from "@mui/material";
import {useState} from "react";
import FriendList from "../friendComponents/FriendList.tsx";

export default function Sidebar() {

    const {theme} = useTheme()

    const navigate = useNavigate()

    /*const getFriendsRequestOptions = {
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization": `Bearer ${token}`
        },

    }

    async function getFriends(){
        const res = await fetch("http://localhost:5174/getFriends",getFriendsRequestOptions)
        if(res.ok){
            return res.json()
        }
        else{
            return res.json()
        }
    }*/

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
    }

    const [openFriend,setOpenFriend] = useState<boolean>(false)
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
                            <img className={"sidebarUserAvatar"} src={placeHolderImage}/>
                        </div>
                        <div className={"sidebarUsernameContainer"}>
                            <span className={"sidebarUsername"}></span>
                        </div>
                        <div className={"sidebarUserActionContainer"}>
                            <span className={"sidebarUserAction"} onClick={()=> navigate("/settings")}><SettingsIcon/></span>
                            <span className={"sidebarUserAction"} onClick={handleOpenFriend}><GroupsIcon/></span>
                            <Modal
                                open={openFriend}
                                onClose={handleCloseFriend}
                            >
                                <Box sx={style}>
                                    <FriendList/>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
