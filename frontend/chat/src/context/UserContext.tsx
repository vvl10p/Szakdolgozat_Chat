import {createContext, ReactNode, useContext, useState} from "react";

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
    user: User
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
    const [user, setUser] = useState<User>(defaultUser)

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}