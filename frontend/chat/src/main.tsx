import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Chat from "./Chat.tsx";
import Settings from "./Settings.tsx";
import Display from "./settings/Display.tsx";
import {ThemeProvider} from "./context/Context.tsx";

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const token = localStorage.getItem("jwt")

    if (!token) {
        return <Navigate to={"/login"} replace/>
    }
    return <>{children}</>
}

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
                        element={
                            <PrivateRoute>
                                <Chat/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={"/settings"}
                        element={
                            <PrivateRoute>
                                <Settings/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={"/display"}
                        element={
                            <PrivateRoute>
                                <Display/>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
