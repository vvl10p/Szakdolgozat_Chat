import './Login.css'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Login as LoginAPI} from "./API/auth.ts";

function Login() {

    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    async function handleLoginRequest() {
        try {
            const res = await LoginAPI(username, password)
            localStorage.setItem("jwt", (res.token))
            setVisible(false)
            navigate("/chat")
            return res
        } catch (err) {
            setVisible(true)
        }
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    return (
        <>
            <div className={"loginContainer"}>
                <form className={"loginForm"}>
                    <label>Username</label>
                    <input form={"loginForm"} className={"loginInput"} type={"text"} name={"username"}
                           onChange={event => setUsername(event.target.value)} placeholder={"Username"} required/>
                    <label>Password</label>
                    <input form={"loginForm"} className={"loginInput"} type={"password"}
                           onChange={event => setPassword(event.target.value)} placeholder={"Password"} required/>
                    <button type={"button"} onClick={() => handleLoginRequest()}>Log in</button>
                    <div className={'errorMessageContainer'} hidden={!visible}>
                        <p className={'errorMessage'}>Invalid username or password</p>
                    </div>
                    <div className={"loginFooter"}>
                        <p className={"loginFooterText"}>
                            Don't have an account? <Link to={"/register"}>Create one</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login