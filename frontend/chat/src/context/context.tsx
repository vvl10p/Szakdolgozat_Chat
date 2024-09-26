import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

type ThemeContextType = {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('THEME') as 'light' | 'dark'
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [])

    const toggleTheme = () => {
        console.log("asd")
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light'
            localStorage.setItem('THEME', newTheme)
            return newTheme
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}