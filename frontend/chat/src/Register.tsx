import './Register.css'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Register as RegisterAPI} from "./API/auth.ts";

function Register() {

    async function handleRegisterRequest() {
        if (username != '' && email != '') {
            try {
                const res = await RegisterAPI(username, password, email)
                setVisible(false)
                navigate("/login")
                return res
            } catch (err) {
                setVisible(true)
            }
        }
    }

    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confPass, setConfPass] = useState('')
    const [email, setEmail] = useState('')

    function matchPassword(password: string, confPass: string) {
        return password == confPass;
    }

    return (
        <>
            <div className={"registerWrapper"}>
                <div className={"registerContainer"}>
                    <form className={"registerForm"}>
                        <label>Email</label>
                        <input className={"registerInput"} type={email} placeholder={"Email"} required={true}
                               onChange={event => {
                                   setEmail(event.target.value)
                               }}/>
                        <label>Username</label>
                        <input className={"registerInput"} type={"text"} placeholder={"Username"} onChange={event => {
                            setUsername(event.target.value)
                        }}/>
                        <label>Password</label>
                        <input className={"registerInput"} type={"password"} placeholder={"Password"}
                               onChange={event => {
                                   setPassword(event.target.value)
                               }}/>
                        <label>Confirm password</label>
                        <input className={"registerInput"} type={"password"} placeholder={"Confirm password"}
                               onChange={event => {
                                   setConfPass(event.target.value)
                               }}/>
                        <div className={"registerButtonContainer"}>
                            <button type={"button"} disabled={!matchPassword(password, confPass)}
                                    onClick={() => handleRegisterRequest()}>Register
                            </button>
                        </div>
                        <div className={'errorMessageContainer'} hidden={!visible}>
                            <p className={'errorMessage'}>Invalid username or password</p>
                        </div>
                        <div className={"registerFooter"}>
                            <p className={"registerFooterText"}>Already have an account? <Link to={"/login"}>Log
                                in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register