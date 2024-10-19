export async function FriendSearch(searchQuery: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            searchQuery
        })
    }
    const res = await fetch("http://localhost:5174/getFriendBySearch", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function friendRecommended(token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({})
    }
    const res = await fetch("http://localhost:5174/getFriendByRecommend", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}