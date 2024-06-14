import './Register.css'
import {useState} from "react";
import {Link} from "react-router-dom";

function register(){
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [confPass,setConfPass] = useState('')
    const [email,setEmail] = useState('')

    const requestOptions = {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify({
            username:username,
            password:password,
            email:email
        })
    }

    function matchPassword(password:string,confPass:string){
        return password == confPass;
    }

    return(
        <>
            <div className={"registerWrapper"}>
                <div className={"registerContainer"}>
                    <form className={"registerForm"}>
                        <label>Username</label>
                        <input className={"registerInput"} type={"text"} placeholder={"Username"} onChange={event => {setUsername(event.target.value)}}/>
                        <label>Password</label>
                        <input className={"registerInput"} type={"password"} placeholder={"Password"} onChange={event => {setPassword(event.target.value)}}/>
                        <label>Confirm password</label>
                        <input className={"registerInput"} type={"password"} placeholder={"Confirm password"} onChange={event => {setConfPass(event.target.value)}}/>
                        <label>Email</label>
                        <input className={"registerInput"} type={email} onChange={event => {setEmail(event.target.value)}}/>
                        <div className={"registerButtonContainer"}>
                            <button type={"button"} disabled={!matchPassword(password,confPass)} onClick={()=>fetch("http://localhost:5174/register",requestOptions).then(response => response.json())}>Register</button>
                            <button type={"button"} onClick={()=>('')}>Back to home</button>
                        </div>
                    </form>
                    <div className={"registerFooter"}>
                        <p className={"registerFooterText"}>Already have an account? <Link to={"/login"}>Log in</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default register