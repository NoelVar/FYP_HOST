// ADAPTED FROM: https://www.youtube.com/playlist?list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT
import { useState } from "react"
import axios from "axios"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    // USE STATES STORING ERRORS AND LOADING
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    // SIGNUP FUNCTION TAKING IN SIGN UP INFO
    const signup = async(username, email, password, confirmPassword) => {
        // SETTING LOADING AND ERROR TO DEFAULT VALUE
        setIsLoading(true)
        setError(null)

        // SENDING REQUEST TO BACKEND API
        const response = await fetch('http://localhost:4000/user/register', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword })
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

    return{ signup, isLoading, error }
}