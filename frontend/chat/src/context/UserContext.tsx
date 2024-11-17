import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type User = {
    ID: number | null,
    username: string | null,
    avatarPath: string | null,
}

const defaultUser: User = {
    ID: null,
    username: null,
    avatarPath: null,
}

interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within the context")
    }
    return context
}

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(defaultUser)

    useEffect(() => {
        const storedUser = localStorage.getItem("USER")

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])

    useEffect(() => {
        if (user) {
            localStorage.setItem("USER", JSON.stringify(user))
        } else {
            localStorage.removeItem("USER")
        }
    }, [user])

        return (
            <UserContext.Provider value={{user, setUser}}>
                {children}
            </UserContext.Provider>
        )
}
