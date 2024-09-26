import {ThemeProvider} from "../context/context.tsx";
import Content from "./displayContent.tsx";
import "./display.css"

function Display(){
    return (
        <ThemeProvider>
                <Content/>
        </ThemeProvider>
    )
}

export default Display