import './App.css'
import {useNavigate} from "react-router-dom";
import {ThemeProvider} from "./context/context.tsx";

function App() {
    const navigate = useNavigate();

    function handleNavigate(url: string) {
        navigate(url);
    }

    return (
        <>
            <ThemeProvider>
                <div className={"mainWrapper"}>
                    <div className={"mainContainer"}>
                        <div className={"mainHeaderContainer"}>
                            <p>Create an account or login in</p>
                        </div>
                        <div className={"mainContentContainer"}>
                            <button onClick={() => handleNavigate('/login')}>Log in</button>
                            <button onClick={() => handleNavigate('/register')}>Register</button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </>
    )
}

export default App
