import "./Display.css"
import {useTheme} from "../context/ThemeContext.tsx";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function Display() {
    const {theme, toggleTheme} = useTheme()
    return (
        <div className={theme === "dark" ? "displayButtonDark" : "displayButton"}>
            <button onClick={toggleTheme}>{theme === "dark" ? <LightModeIcon/> : <DarkModeIcon/>}</button>
        </div>
    )
}

export default Display