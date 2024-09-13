import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Chat from "./Chat.tsx";
import Settings from "./Settings.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
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
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
