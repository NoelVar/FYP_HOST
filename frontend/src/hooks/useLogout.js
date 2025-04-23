import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        // NOTE: REMOVE USER FROM LOCAL STORAGE
        localStorage.clear()

        // NOTE: DISPATCH LOGOUT ACTION
        dispatch({type: 'LOGOUT'})
    }

    return { logout }
}