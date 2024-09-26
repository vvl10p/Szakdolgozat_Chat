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
    const res = await fetch("http://localhost:5174/register", requestOptions)
    if (!res.ok) {
        throw new Error()
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
    const res = await fetch("http://localhost:5174/login", requestOptions)
    if (!res.ok) {
        throw new Error()
    }
    return await res.json()
}