export async function FriendSearch(searchQuery: string, token: string) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }
    const res = await fetch(`http://localhost:5174/friend/get/?${new URLSearchParams({searchQuery: searchQuery})}`, requestOptions)
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
    const res = await fetch("http://localhost:5174/friend/update", requestOptions)
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
    const res = await fetch("http://localhost:5174/friend/list_friends", requestOptions)
    if (!res.ok) {
        throw new Error
    }
    return await res.json()
}