import './App.css'
import {useNavigate} from "react-router-dom";
import {useTheme} from "./context/ThemeContext.tsx";
import {useEffect, useRef} from "react";

function App() {
    const navigate = useNavigate()

    function handleNavigate(url: string) {
        navigate(url)
    }

    const loginButtonRef = useRef<HTMLButtonElement | null>(null)
    const registerButtonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (loginButtonRef.current) {
            loginButtonRef.current.focus();
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "l") {
                handleNavigate("/login")
            } else if (e.key === "r") {
                handleNavigate("/register")
            }
            if (e.key === "ArrowRight") {
                if (document.activeElement === loginButtonRef.current) {
                    registerButtonRef.current?.focus()
                }
            } else if (e.key === "ArrowLeft") {
                if (document.activeElement === registerButtonRef.current) {
                    loginButtonRef.current?.focus()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    })


    const {theme} = useTheme()

    return (
        <>
            <div className={theme === "dark" ? "mainWrapperDark" : "mainWrapper"}>
                <div className={theme === "dark" ? "mainContainerDark" : "mainContainer"}>
                    <div className={theme === "dark" ? "mainHeaderContainerDark" : "mainHeaderContainer"}>
                        <p>Create an account or login in</p>
                    </div>
                    <div className={theme === "dark" ? "mainContentContainerDark" : "mainContentContainer"}>
                        <button ref={loginButtonRef} onClick={() => handleNavigate('/login')} tabIndex={0}>Log in (L)
                        </button>
                        <button ref={registerButtonRef} onClick={() => handleNavigate('/register')}
                                tabIndex={0}>Register (R)
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
