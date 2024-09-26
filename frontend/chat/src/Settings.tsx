import "./Settings.css"
import "./settings/display.tsx"

function Settings() {

    return (
        <>
            <div className={"settingsContainer"}>
                <div className={"settingsSidebarContainer"}>
                    <div className={"settingsSidebarHeader"}>
                        <span>Settings</span>
                    </div>
                    <div className={"settingsSidebarContent"}>
                        <span>Display</span>
                        <span>User settings</span>
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
        </>
    )
}

export default Settings;