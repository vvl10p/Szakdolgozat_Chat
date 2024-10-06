import "./Sidebar.css"
import ChatCard from "./ChatCard.tsx";
import {useNavigate} from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import {useTheme} from "../../context/Context.tsx";

export default function Sidebar() {

    const {theme} = useTheme()

    const navigate = useNavigate()

    /*const getFriendsRequestOptions = {
        method:"POST",
        headers:{"Content-type":"application/json","jwt":localStorage.getItem("jwt")},
        body:JSON.stringify({
            id:id,
            username:username,
            lastMessage:lastMessage
        }
        )
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
                    <div
                        className={theme === "dark" ? "sidebarContentDark sidebarButtonDark" : "sidebarContent sidebarButton"}
                        onClick={() => {
                            navigate("/settings")
                        }}>
                        <SettingsIcon className={"sidebarSettingsIcon"}/>
                        <span
                            className={theme === "dark" ? "sidebarSettingsTextDark" : "sidebarSettingsText"}>Settings</span>
                    </div>
                    <span>ChatApp</span>
                </div>
            </div>
        </>
    )
}
