import './App.css'
import {Link} from "react-router-dom";

function App() {

  return (
    <>
        <div className={"mainWrapper"}>
            <div className={"mainContainer"}>
                <div className={"mainHeaderContainer"}>
                    <p>Create an account or login in</p>
                </div>
                <div className={"mainContentContainer"}>
                    <button><Link to={"/login"} relative={"path"}>Log in</Link></button>
                    <button><Link to={"/register"} relative={"path"}>Register</Link></button>
                </div>
            </div>
        </div>
    </>
  )
}

export default App
