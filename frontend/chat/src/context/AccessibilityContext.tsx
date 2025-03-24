import React, {useContext, useState} from "react";

interface AccessibilityContext {
    visionFilter: boolean
    hearingFilter: boolean
    epilepsyFilter: boolean
    movementFilter: boolean
}




const AccessibilityContext = React.createContext<AccessibilityContext>({
    visionFilter: false,
    hearingFilter: true,
    epilepsyFilter: true,
    movementFilter: false,
})

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext)
    if (!context) {
        throw new Error('useAccessibility must be a function')
    }
    return context
}

export const AccessibilityProvider = ({children}: { children: React.ReactNode }) => {
    /*const [visionFilter, setVisionFilter] = useState<boolean>(false)
    const [hearingFilter, setHearingFilter] = useState<boolean>(true)
    const [epilepsyFilter, setEpilepsyFilter] = useState<boolean>(true)
    const [movementFilter, setMovementFilter] = useState<boolean>(false)*/

    return (
        <AccessibilityContext.Provider value={{visionFilter, hearingFilter, epilepsyFilter, movementFilter}}>
            {children}
        </AccessibilityContext.Provider>
    )
}