export async function FriendSearch(searchQuery: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(`http://localhost:5174/user/get/?searchQuery=${encodeURIComponent(searchQuery)}`, requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function FriendRecommended(token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch("http://localhost:5174/getFriendByRecommend", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}