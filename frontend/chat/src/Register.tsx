import './Register.css'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Register as RegisterAPI} from "./API/auth.ts";
import {useTheme} from "./context/ThemeContext.tsx";

function Register() {
    const {theme} = useTheme()

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

    function validateEmail(email: string): boolean {
        return emailRegex.test(email)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleRegisterRequest()
        }
    }

    async function handleRegisterRequest() {
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email")
            setVisible(true)
            return
        }
        if (username == '') {
            setErrorMessage("Invalid username")
            setVisible(true)
            return
        }
        if (password.length < 8) {
            setErrorMessage("Password must contain 8 characters or more")
            setVisible(true)
            return
        }
        if (password != confPass) {
            setErrorMessage("Passwords don't match")
            setVisible(true)
            return
        }
        if (password == confPass) {
            try {
                const res = await RegisterAPI(username, password, email.toLowerCase())
                setVisible(false)
                navigate("/login")
                return res
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorMessage(err.message)
                    setVisible(true)
                }
                setErrorMessage("Something went wrong")
                setVisible(true)
            }
        }
    }

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('')
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confPass, setConfPass] = useState('')
    const [email, setEmail] = useState('')

    return (
        <>
            <div className={theme === "dark" ? "registerWrapperDark" : "registerWrapper"} onKeyDown={handleKeyDown}>
                <div className={theme === "dark" ? "registerContainerDark" : "registerContainer"}>
                    <form className={theme === "dark" ? "registerFormDark" : "registerForm"}>
                        <label>Email</label>
                        <input className={theme === "dark" ? "registerInputDark" : "registerInput"} type={email} autoComplete={"email"}
                               placeholder={"Email"} required={true}
                               onChange={event => {
                                   setEmail(event.target.value)
                               }}/>
                        <label>Username</label>
                        <input className={theme === "dark" ? "registerInputDark" : "registerInput"} type={"text"} autoComplete={"off"}
                               placeholder={"Username"} onChange={event => {
                            setUsername(event.target.value)
                        }}/>
                        <label>Password</label>
                        <input className={theme === "dark" ? "registerInputDark" : "registerInput"} type={"password"} autoComplete={"new-password"}
                               placeholder={"Password"}
                               onChange={event => {
                                   setPassword(event.target.value)
                               }}/>
                        <label>Confirm password</label>
                        <input className={theme === "dark" ? "registerInputDark" : "registerInput"} type={"password"} autoComplete={"off"}
                               placeholder={"Confirm password"}
                               onChange={event => {
                                   setConfPass(event.target.value)
                               }}/>
                        <div className={theme === "dark" ? "registerButtonContainerDark" : "registerButtonContainer"}>
                            <button className={theme === "dark" ? "registerButtonDark" : "registerButton"}
                                    type={"button"}
                                    onClick={() => handleRegisterRequest()}>Register
                            </button>
                        </div>
                        <div className={"errorMessageContainer"} hidden={!visible}>
                            <p className={"errorMessage"}>{errorMessage}</p>
                        </div>
                        <div className={theme === "dark" ? "registerFooterDark" : "registerFooter"}>
                            <p className={theme === "dark" ? "registerFooterTextDark" : "registerFooterText"}>Already
                                have an account? <span onClick={() => navigate('/login')}>Log
                                    in</span></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register