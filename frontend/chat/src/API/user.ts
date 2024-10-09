export async function AvatarUpload(token: string, imageBase64: string) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            imageBase64
        })
    }
    const res = await fetch("http://localhost/avatar_upload", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return res.json()
}

export async function ChangePassword(token: string, newPassword: string) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            newPassword
        })
    }
    const res = await fetch("http://localhost/change_password", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return res.json()
}
