import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        // NOTE: REMOVE USER FROM LOCAL STORAGE
        localStorage.removeItem('user')

        // NOTE: DISPATCH LOGOUT ACTION
        dispatch({type: 'LOGOUT'})
    }

    return { logout }
}