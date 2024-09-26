import './Login.css'
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ThemeProvider} from "./context/context.tsx";

function Login(){

    const navigate = useNavigate();
    const [visible,setVisible]=useState(false);

    async function handleLoginRequest(){
        const res = await fetch("http://localhost:5174/login",requestOptions)
        if(res.ok){
            localStorage.setItem("jwt",(await res.json()).token)
            setVisible(false)
            navigate("/chat")
            return res.json()
        }
        else {
            setVisible(true)
            return res.json()
        }
    }

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const requestOptions = {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            username:username,
            password:password
        })
    }

    return(
        <>
            <ThemeProvider>
            <div className={"loginContainer"}>
                <form className={"loginForm"}>
                    <label>Username</label>
                    <input form={"loginForm"} className={"loginInput"} type={"text"}
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
            </ThemeProvider>
        </>
    )
}

export default Login