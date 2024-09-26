import {useTheme} from "../context/context.tsx";

function Content(){
    const {theme,toggleTheme} = useTheme()
    return (
            <div>
                <button onClick={toggleTheme}>{theme === "dark" ? "light" : "dark"}</button>
            </div>
    )
}

export default Content