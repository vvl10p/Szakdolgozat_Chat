import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type User = {
    id: number | null,
    username: string | null,
    avatarPath: string | null,
}

const defaultUser: User = {
    id: null,
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

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
