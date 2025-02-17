import {createContext, ReactNode, useContext, useEffect, useState} from "react";

type User = {
    id: number,
    username: string,
    avatarPath: string,
}

interface UserContextType {
    user?: User
    setUser: (user: User) => void
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
    const [user, setUser] = useState<User>()

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
