import './Login.css'
import {useState} from "react";

function Login(){
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
            <div>
                <form className={"loginForm"}>
                    <input form={"loginForm"} className={"loginInput"} type={"text"} onChange={event => setUsername(event.target.value)} placeholder={"username"}/>
                    <input form={"loginForm"} className={"loginInput"} type={"password"} onChange={event => setPassword(event.target.value)} placeholder={"password"}/>
                    <button type={"button"} onClick={()=>fetch("http://localhost:5174/login",requestOptions).then(response => response.json())}>Log in</button>
                </form>
            </div>
        </>
    )
}

export default Login