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
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/avatar_upload", requestOptions)
    const data = await res.json().catch(() => null)
    if (!res.ok || data.avatarPath == "") {
        throw new Error
    }
    return await {data, status: res.status}
}

export async function ChangePassword(token: string, newPassword: string, oldPassword: string) {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
        })
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/user/update_password", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.status
}

export async function GetUserData(token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/user/data", requestOptions)
    if (!res.ok) {
        throw new Error
    }

    return await res.json()
}