export async function getMessages(ChatID: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(`http://localhost:5174/getMessage/id?id=${ChatID}`, requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}