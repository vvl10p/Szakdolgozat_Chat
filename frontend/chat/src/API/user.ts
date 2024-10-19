export async function AvatarUpload(token: string, avatarPath: string) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            avatarPath
        })
    }
    const res = await fetch("http://localhost:5174/avatar_upload", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
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
    const res = await fetch("http://localhost:5174/change_password", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function GetUserData(token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch("http://localhost:5174/user/data", requestOptions)
    if (!res.ok) {
        throw new Error
    }

    return await res.json()
}