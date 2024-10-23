import "./Settings.css"
import "./settings/Display.tsx"
import {useState} from "react";
import Display from "./settings/Display.tsx";
import UserSettings from "./settings/UserSettings.tsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "./context/ThemeContext.tsx";

function Settings() {
    const {theme} = useTheme()
    const [currentComponent, setCurrentComponent] = useState('')

    const navigate = useNavigate()

    const renderComponent = () => {
        switch (currentComponent) {
            case "Display":
                return <Display/>
            case "User settings":
                return <UserSettings/>
            default:
                return null
        }
    }

    return (
        <>
            <div className={theme === "dark" ? "settingsContainerDark" : "settingsContainer"}>
                <div className={theme === "dark" ? "settingsSidebarContainerDark" : "settingsSidebarContainer"}>
                    <div className={theme === "dark" ? "settingsSidebarHeaderDark" : "settingsSidebarHeader"}>
                        <span>Settings</span>
                    </div>
                    <div className={theme === "dark" ? "settingsSidebarContentDark" : "settingsSidebarContent"}
                         onClick={() => setCurrentComponent('Display')}>
                        <span>Display</span>
                    </div>
                    <div className={theme === "dark" ? "settingsSidebarContentDark" : "settingsSidebarContent"}
                         onClick={() => setCurrentComponent('User settings')}>
                        <span>User settings</span>
                    </div>
                    <div className={theme === "dark" ? "settingsSidebarFooter" : "settingsSidebarFooter"}
                         onClick={() => navigate("/chat")}>
                        <span>ChatApp</span>
                    </div>
                </div>
                <div className={theme === "dark" ? "settingsMainContainerDark" : "settingsMainContainer"}>
                    <div className={theme === "dark" ? "settingsMainHeaderDark" : "settingsMainHeader"}>
                        <span>{currentComponent}</span>
                    </div>
                    <div className={theme === "dark" ? "settingsMainContentDark" : "settingsMainContent"}>
                        {renderComponent()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;