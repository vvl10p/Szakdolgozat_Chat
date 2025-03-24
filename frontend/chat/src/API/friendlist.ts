export async function FriendSearch(searchQuery: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+`/friend/get/?${new URLSearchParams({searchQuery: searchQuery})}`, requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function UpdateFriendStatus(token: string, friendId: string, status: string) {
    console.log(token, friendId, status)
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            friendId,
            status
        })
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/friend/update", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}

export async function FriendsForSidebar(token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/friend/list_friends", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}