import {useTheme} from "../context/Context.tsx";
import {useRef, useState} from "react";
import {Box, Modal} from "@mui/material";
import "./UserSettings.css";

function UserSettings() {
    const {theme} = useTheme()

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setSelectedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click()
        }
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

    const [openPassword, setOpenPassword] = useState(false)
    const handleOpenPassword = () => setOpenPassword(true)
    const handleClosePassword = () => setOpenPassword(false)

    const [openAvatar, setOpenAvatar] = useState(false)
    const handleOpenAvatar = () => setOpenAvatar(true)
    const handleCloseAvatar = () => setOpenAvatar(false)

    return (
        <>
            <button className={theme === "dark" ? "userSettingsChangeButtonDark" : "userSettingsChangeButton"}
                    onClick={handleOpenAvatar}>Change
                avatar
            </button>
            <Modal
                open={openAvatar}
                onClose={handleCloseAvatar}
            >
                <Box sx={style}>
                    <div className={"userSettingsAvatarContainer"}>
                        <div className={"userSettingsAvatarImageContainer"}>
                            <img className={"userSettingsAvatarImage"}
                                 src={selectedImage || "https://via.placeholder.com/400"} alt={"AvatarImagePlaceholder"}
                                 onClick={handleImageClick}></img>
                        </div>
                        <input
                            type={"file"}
                            ref={inputFileRef}
                            style={{display: "none"}}
                            accept={"image/*"}
                            onChange={handleFileChange}
                        />
                        <div className={"userSettingsAvatarButtonContainer"}>
                            <button className={"userSettingsAvatarButton"} onClick={handleCloseAvatar}>Close</button>
                            <button className={"userSettingsAvatarButton"}>Change avatar</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <button className={theme === "dark" ? "userSettingsChangeButtonDark" : "userSettingsChangeButton"}
                    onClick={handleOpenPassword}>Change
                password
            </button>
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
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default UserSettings