import './App.css'
import {useNavigate} from "react-router-dom";
import {useTheme} from "./context/ThemeContext.tsx";

function App() {
    const navigate = useNavigate();

    function handleNavigate(url: string) {
        navigate(url);
    }

    const {theme} = useTheme()

    return (
        <>
            <div className={theme === "dark" ? "mainWrapperDark" : "mainWrapper"}>
                <div className={theme === "dark" ? "mainContainerDark" : "mainContainer"}>
                    <div className={theme === "dark" ? "mainHeaderContainerDark" : "mainHeaderContainer"}>
                        <p>Create an account or login in</p>
                    </div>
                    <div className={theme === "dark" ? "mainContentContainer" : "mainContentContainer"}>
                        <button onClick={() => handleNavigate('/login')}>Log in</button>
                        <button onClick={() => handleNavigate('/register')}>Register</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
