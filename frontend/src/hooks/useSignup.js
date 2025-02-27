// RESEARCH / REFERENCE: https://www.youtube.com/playlist?list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT
import { useState } from "react"
import axios from "axios"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async(username, email, password, confirmPassword) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:4000/user/register', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword })
        })
        const json = await response.json()

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

    return{ signup, isLoading, error }
}