import "./Settings.css"

function Settings() {
    return(
        <>
            <div className={"settingsContainer"}>
                <div className={"settingsSidebarContainer"}>
                    <div className={"settingsSidebarHeader"}>
                        <span>Sidebar Header</span>
                    </div>
                    <div className={"settingsSidebarContent"}>
                        <span>Sidebar Content</span>
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