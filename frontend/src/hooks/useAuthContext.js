// ADAPTED FROM: https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    // CONSUME AUTH CONTEXT
    const context = useContext(AuthContext)

    // CHECKING IF 'context' IS NOT USED OUTSIDE OF SCOPE (APP)
    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    // RETURNS CONTEXT
    return context
}