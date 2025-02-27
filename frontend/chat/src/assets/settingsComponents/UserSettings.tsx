import {useTheme} from "../../context/ThemeContext.tsx";
import {useEffect, useRef, useState} from "react";
import {Box, Modal} from "@mui/material";
import "./UserSettings.css";
import {useNavigate} from "react-router-dom";
import {AvatarUpload as AvatarUploadAPI, ChangePassword as ChangePasswordAPI} from "../../API/user.ts";
import avatarPlaceholder from "./avatarPlaceholder.png";
import {useUser} from "../../context/UserContext.tsx";

function UserSettings() {
    const {theme} = useTheme()
    const navigate = useNavigate()
    const {user, setUser} = useUser()

    const MAX_FILE_SIZE = 5 * 1024 * 1024

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [imageMessageHidden, setImageMessageHidden] = useState<boolean>(true)
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const [passwordErrorHidden, setPasswordErrorHidden] = useState<boolean>(true)

    const [seconds, setSeconds] = useState<number>(10)
    const [countdownStarted, setCountdownStarted] = useState<boolean>(false)

    const startCountdown = () => {
        setCountdownStarted(true)
    }

    useEffect(() => {
       if (!countdownStarted || seconds === 0) return
        setPasswordError(seconds > 1 ? `Password changed successfully, you will be logged out in ${seconds} seconds` : `Password changed successfully, you will be logged out in ${seconds} second`)
        const intervalId = setInterval(() => {
            setSeconds((prev) => prev - 1)
        },1000)
        return () => clearInterval(intervalId)
    },[countdownStarted,seconds])

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
        if (token && selectedImage !== "") {
            try {
                const res = await AvatarUploadAPI(token, selectedImage)
                if (res.status === 200 && res.data) {
                    setErrorMessage("Avatar successfully uploaded")
                    setImageMessageHidden(false)
                    if (!user) {
                        return
                    }
                    const updatedUser = {...user, avatarPath: res.data}
                    setUser(updatedUser)
                    localStorage.setItem("USER", JSON.stringify(updatedUser))
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    setUser((prev) => prev ? {...prev} : prev)
                }
            } catch (err) {
                setErrorMessage("Avatar upload failed")
                setImageMessageHidden(false)
                return
            }
        } else return
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    async function handlePasswordChange() {
        if (!token) {
            return
        }
        if (newPassword === "") {
            setPasswordError("New Password cannot be empty")
            setPasswordErrorHidden(false)
            return
        } else if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters")
            setPasswordErrorHidden(false)
            return
        } else if (oldPassword === newPassword) {
            setPasswordError("New Password cannot be the same as the Old Password")
            setPasswordErrorHidden(false)
            return
        } else if (newPassword !== newPasswordConfirm) {
            setPasswordError("Confirm Passwords do not match")
            setPasswordErrorHidden(false)
            return
        } else if (oldPassword === "") {
            setPasswordError("Old Password cannot be empty")
            setPasswordErrorHidden(false)
            return
        } else {
            setPasswordError("")
            setPasswordErrorHidden(true)
            try {
                const res = await ChangePasswordAPI(token, newPassword, oldPassword)
                console.log(res)
                if (res == 200) {
                    startCountdown()
                    setPasswordErrorHidden(false)
                    setTimeout(async () => {
                        await timeout(10000)
                        handleLogOut()
                    }, 0)
                } else {
                    setPasswordError(res.toString() || "An error occurred")
                    setPasswordErrorHidden(false)
                }
            } catch (err) {
                console.error("Error changing password:", err)
                setPasswordError("Something went wrong, please try again.")
                setPasswordErrorHidden(false)
            }
        }
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
                            <span hidden={imageMessageHidden}>{errorMessage}</span>
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
                            <label>Old Password</label>
                            <input type={"password"} onChange={(e) => setOldPassword(e.target.value)}></input>
                            <label>New password</label>
                            <input type={"password"} onChange={(e) => {
                                setNewPassword(e.target.value)
                            }}></input>
                            <label>Confirm new password</label>
                            <input type={"password"} onChange={(e) => {
                                setNewPasswordConfirm(e.target.value)
                            }}></input>
                            <button onClick={handlePasswordChange}>Change password</button>
                            <p hidden={passwordErrorHidden}>{passwordError}</p>
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