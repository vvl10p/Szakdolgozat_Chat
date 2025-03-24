export async function getMessages(ChatID: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+`/getMessage/id?id=${ChatID}`, requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function updateSeenBy(ChatID: string, token: string) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+`/updateSeenBy/id?id=${ChatID}`, requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}