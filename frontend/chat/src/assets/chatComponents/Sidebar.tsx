import "./Sidebar.css"
import {useNavigate} from "react-router-dom";
import ChatCard from "./ChatCard.tsx";
//import SettingsIcon from '@mui/icons-material/Settings';
/*import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';*/

export default function Sidebar(){

    function mapChats(){
        return (
            <>
                <div className={"sidebarContent"}>
                    <ChatCard/>
                </div>
            </>
        )
    }

    const navigate = useNavigate();

    return (
        <>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"/>
            <div className={"sidebarContainer"}>
                <div className={"sidebarHeader"}>
                    <span>Messages</span>
                </div>
                <div className={"sidebarContentContainer"}>
                    <div className={"sidebarContent"}>
                        {mapChats()}
                    </div>
                </div>
                <div className={"sidebarFooter"}>
                    <div className={"sidebarContent sidebarButton"} onClick={() => navigate("/settings")}>
                        <span className={"material-icons sidebarSettingsIcon"}>settings</span>
                        <span className={"sidebarSettingsText"}>Settings</span>
                    </div>
                    <span>ChatApp</span>
                </div>
            </div>
            {/*
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"/>
            <div className={"sidebarContainer"}>
                <div className={"sidebarHeader"}>
                    <span>Messages</span>
                </div>
                <div className={"sidebarComponent"}>
                    <div className={"sidebarContent"}>
                        <div className={"sidebarMessagesContainer"}>
                            {mapChats()}
                        </div>
                    </div>
                    <div className={"sidebarFooter"}>
                        <div className={"sidebarContent"} onClick={() => (navigate("/settings"))}>
                            <span className={"material-icons sidebarSettingsIcon"}>settings</span>
                            <span className={"sidebarSettingsText"}>Settings</span>
                        </div>
                        <div className={"sidebarContent"}>
                            <div className={"sidebarBrandContainer"}>
                                <div className={"sidebarLogo"}>
                                    <img src={"src/assets/react.svg"} alt="logo"/>
                                </div>
                                <div className={"sidebarBrandText"}>
                                    <p>ChatApp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}
        </>
    )
}
