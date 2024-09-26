import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Chat from "./Chat.tsx";
import Settings from "./Settings.tsx";
import Display from "./settings/display.tsx";
import {ThemeProvider} from "./context/context.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <Routes>
                    <Route
                        path={"/"}
                        element={<App/>}
                    />
                    <Route
                        path={"/login"}
                        element={<Login/>}
                    />
                    <Route
                        path={"/register"}
                        element={<Register/>}
                    />
                    <Route
                        path={"/chat"}
                        element={<Chat/>}
                    />
                    <Route
                        path={"/settings"}
                        element={<Settings/>}
                    />
                    <Route
                        path={"/display"}
                        element={<Display/>}
                    />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
