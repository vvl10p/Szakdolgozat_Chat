import {useTheme} from "../../context/ThemeContext.tsx";
import {useRef, useState} from "react";
import {Box, Modal} from "@mui/material";
import "./UserSettings.css";
import {useNavigate} from "react-router-dom";
import {AvatarUpload as AvatarUploadAPI} from "../../API/user.ts";
import avatarPlaceholder from "./avatarPlaceholder.png";

function UserSettings() {
    const {theme} = useTheme()
    const navigate = useNavigate()

    const MAX_FILE_SIZE = 5 * 1024 * 1024

    const [errorMessage, setErrorMessage] = useState<string>("")

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage(`File size exceeds the ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)}MB limit.`)
                return
            } else {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setSelectedImage(reader.result as string)
                    setErrorMessage("")
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const handleImageClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click()
        }
    }

    const token: string | null = localStorage.getItem("jwt")

    async function handleAvatarUploadRequest() {
        if (token && selectedImage) {
            try {
                const res = await AvatarUploadAPI(token, selectedImage)
                return res.data;
            } catch (err) {
                return
            }
        } else return
    }

    const handleLogOut = () => {
        localStorage.removeItem("jwt")
        localStorage.removeItem("USER")
        navigate("/")
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 600,
        borderRadius: 5,
        boxShadow: 24,
        backgroundColor: "#333",
        p: 4,
    }

    const [openPassword, setOpenPassword] = useState<boolean>(false)
    const handleOpenPassword = () => setOpenPassword(true)
    const handleClosePassword = () => setOpenPassword(false)

    const [openAvatar, setOpenAvatar] = useState<boolean>(false)
    const handleOpenAvatar = () => setOpenAvatar(true)
    const handleCloseAvatar = () => setOpenAvatar(false)

    return (
        <>
            <div className={theme === "dark" ? "userSettingsContainerDark" : "userSettingsContainer"}>
                <div className={theme === "dark" ? "userSettingsButtonContainerDark" : "userSettingsButtonContainer"}>
                    <button className={theme === "dark" ? "userSettingsChangeButtonDark" : "userSettingsChangeButton"}
                            onClick={handleOpenAvatar}>Change
                        avatar
                    </button>
                </div>
                <Modal
                    open={openAvatar}
                    onClose={handleCloseAvatar}
                >
                    <Box sx={style}>
                        <div
                            className={theme === "dark" ? "userSettingsAvatarContainerDark" : "userSettingsAvatarContainer"}>
                            <div
                                className={theme === "dark" ? "userSettingsAvatarImageContainerDark" : "userSettingsAvatarImageContainer"}>
                                <img className={"userSettingsAvatarImage"}
                                     src={selectedImage || avatarPlaceholder}
                                     alt={"AvatarImagePlaceholder"}
                                     onClick={handleImageClick}>
                                </img>
                            </div>
                            <input
                                type={"file"}
                                ref={inputFileRef}
                                style={{display: "none"}}
                                accept={"image/*"}
                                onChange={handleFileChange}
                            />
                            <div
                                className={theme === "dark" ? "userSettingsAvatarButtonContainerDark" : "userSettingsAvatarButtonContainer"}>
                                <button
                                    className={theme === "dark" ? "userSettingsAvatarButtonDark" : "userSettingsAvatarButton"}
                                    onClick={handleCloseAvatar}>Close
                                </button>
                                <button
                                    className={theme === "dark" ? "userSettingsAvatarButtonDark" : "userSettingsAvatarButton"}
                                    onClick={handleAvatarUploadRequest}>Change avatar
                                </button>
                            </div>
                            <span>{errorMessage}</span>
                        </div>
                    </Box>
                </Modal>
                <div
                    className={theme === "dark" ? "userSettingsAvatarButtonContainerDark" : "userSettingsAvatarButtonContainer"}>
                    <button className={theme === "dark" ? "userSettingsChangeButtonDark" : "userSettingsChangeButton"}
                            onClick={handleOpenPassword}>Change
                        password
                    </button>
                </div>
                <Modal
                    open={openPassword}
                    onClose={handleClosePassword}
                >
                    <Box sx={style}>
                        <div>
                            <label>New password</label>
                            <input type={"password"}></input>
                            <label>Confirm new password</label>
                            <input type={"password"}></input>
                            <button>Change password</button>
                            <p>Error message</p>
                        </div>
                    </Box>
                </Modal>
                <div
                    className={theme === "dark" ? "userSettingsAvatarButtonContainerDark" : "userSettingsAvatarButtonContainer"}>
                    <button
                        className={theme === "dark" ? "userSettingsAvatarButtonDark" : "userSettingsAvatarButton"}>Manage
                        Blocked Users
                    </button>
                </div>
                <div
                    className={theme === "dark" ? "userSettingsAvatarButtonContainerDark" : "userSettingsAvatarButtonContainer"}>
                    <button className={theme === "dark" ? "userSettingsAvatarButtonDark" : "userSettingsAvatarButton"}
                            onClick={handleLogOut}>Log out
                    </button>
                </div>
            </div>
        </>
    )
}

export default UserSettings