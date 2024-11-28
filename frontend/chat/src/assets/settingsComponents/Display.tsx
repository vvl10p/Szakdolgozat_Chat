import "./Display.css"
import {useTheme} from "../../context/ThemeContext.tsx";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function Display() {
    const {theme, toggleTheme} = useTheme()
    return (
        <>
            <div className={theme === "dark" ? "displayContainerDark" : "displayContainer"}>
                <div className={theme === "dark" ? "displayButtonContainerDark" : "displayContainerButton"}>
                    <button className={theme === "dark" ? "displayButtonDark" : "displayButton"}
                            onClick={toggleTheme}>{theme === "dark" ? <LightModeIcon/> : <DarkModeIcon/>}</button>
                </div>
                <div className={theme === "dark" ? "displayButtonContainerDark" : "displayButtonContainer"}>
                    <button className={theme === "dark" ? "displayButtonDark" : "displayButton"}>Change font size
                    </button>
                </div>
            </div>
        </>
    )
}

export default Display