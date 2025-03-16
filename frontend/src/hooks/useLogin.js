// ADAPTED FROM: https://www.youtube.com/playlist?list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT
import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    // INITIALIZING STATE VARIABLES
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    // LOGIN FUNCTION TAKES IN LOGIN INFO
    const login = async(email, password) => {
        // SETTING DEFAULT VALUES
        setIsLoading(true)
        setError(null)

        // SENDING REQUEST AND DATA TO BACKEND API
        const response = await fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()

        // VALIDATING RESPONSE
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // NOTE: SAVE THE USER TO LOCAL STORAGE
            localStorage.setItem('user', JSON.stringify(json))

            // NOTE: UPDATE AUTH CONTEXT
            dispatch({ type: 'LOGIN', payload: json })

            setIsLoading(false)
        }
    }

    return{ login, isLoading, error }
}