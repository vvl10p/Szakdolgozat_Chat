export async function Register(username: string, password: string, email: string) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            username,
            password,
            email
        })
    }
    const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/register", requestOptions)
    if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data.message)
    }
    return await res.json()
}

export async function Login(username: string, password: string) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            username,
            password,
        })
    }
    try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/login", requestOptions)
        if (!res.ok) {
            const data = await res.json().catch(() => null)

            throw new Error(data.message)
        }
        return await res.json()
    }
    catch (error) {
        alert(error)
    }

}