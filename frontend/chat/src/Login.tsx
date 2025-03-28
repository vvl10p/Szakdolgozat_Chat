import './Login.css'
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Login as LoginAPI} from "./API/auth.ts";
import {useTheme} from "./context/ThemeContext.tsx";
import {useUser} from "./context/UserContext.tsx";
import {Link} from "react-router-dom";

function Login() {

    const {setUser} = useUser();
    const {theme} = useTheme()
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleLoginRequest()
        }
    }

    async function handleLoginRequest() {
        try {
            const res = await LoginAPI(username.toLowerCase(), password)
            if (res && res.token && res.user) {
                setUser({
                    id: res.user.id,
                    username: res.user.username,
                    avatarPath: res.user.avatarPath,
                })
                localStorage.setItem("jwt", (res.token))
                localStorage.setItem("USER", JSON.stringify(res.user))
                setVisible(false)
                navigate("/chat")
                return res
            } else {
                throw new Error("Invalid response from server")
            }

        } catch (err) {
            setVisible(true)
        }
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    return (
        <>
            <div className={theme === "dark" ? "loginContainerDark" : "loginContainer"} onKeyDown={handleKeyDown}>
                <form className={theme === "dark" ? "loginFormDark" : "loginForm"}>
                    <label htmlFor={"username"}>Username</label>
                    <input form={theme === "dark" ? "loginFormDak" : "loginForm"} autoComplete={"username"}
                           className={theme === "dark" ? "loginInputDark" : "loginInput"} type={"text"}
                           name={"username"} tabIndex={0}
                           onChange={event => setUsername(event.target.value)} placeholder={"Username"} required/>
                    <label htmlFor={"password"}>Password</label>
                    <input form={"loginForm"} className={theme === "dark" ? "loginInputDark" : "loginInput"} autoComplete={"current-password"}
                           type={"password"} tabIndex={0}
                           onChange={event => setPassword(event.target.value)} placeholder={"Password"} required/>
                    <button type={"button"} tabIndex={0} onClick={() => handleLoginRequest()}>Log in</button>
                    <div className={"errorMessageContainer"} hidden={!visible}>
                        <p className={"errorMessage"}>Invalid username or password</p>
                    </div>
                    <div className={theme === "dark" ? "loginFooterDark" : "loginFooter"}>
                        <p className={theme === "dark" ? "loginFooterTextDark" : "loginFooterText"}>
                            Don't have an account? <Link className={theme === "dark" ? "loginFooterLinkDark" : "loginFooterLink"} to={'/register'} tabIndex={0}>Create one</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login
