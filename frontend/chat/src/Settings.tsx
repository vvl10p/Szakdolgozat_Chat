import "./Settings.css"
import "./settings/display.tsx"
import {ThemeProvider} from "./context/context.tsx";

function Settings() {
    return(
        <>
            <ThemeProvider>
            <div className={"settingsContainer"}>
                <div className={"settingsSidebarContainer"}>
                    <div className={"settingsSidebarHeader"}>
                        <span>Sidebar Header</span>
                    </div>
                    <div className={"settingsSidebarContent"}>
                        <span>Display</span>
                    </div>
                </div>
                <div className={"settingsMainContainer"}>
                    <div className={"settingsMainHeader"}>
                        <span>Main Header</span>
                    </div>
                    <div className={"settingsMainContent"}>
                        <span>Main Content</span>
                    </div>
                </div>
            </div>
            </ThemeProvider>
        </>
    )
}

export default Settings;