// ADAPTED FROM :https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { createContext, useReducer, useEffect} from 'react';

// CREATING CONTEXT
export const AuthContext = createContext()

// TAKES IN PREVIOUS STATE AND ACTION
export const authReducer = (state, action) => {
    switch (action.type) {
        // LOGIN CASE (FOR REGISTERING TOO)
        case 'LOGIN': 
            // THE USER IS WHAT THE SERVER SENDS BACK
            return { user: action.payload }
        // LOGOUT CASE
        case 'LOGOUT':
            // SETS USER TO NULL (NOT LOGGED IN)
            return { user: null }
        default:
            // NO CHANGE RETURN ORIGINAL STATE
            return state
    }
}

// CUSTOM COMPONENT
export const AuthContextProvider = ({ children }) => { // CHILDREN REPRESENTS WHATEVER THE COMPONENT WRAPS
    const [state, dispatch] = useReducer(authReducer, {
        // GENERALY USER IS NOT LOGGED IN
        user: null
    })

    // NOTE: ONLY FIRE FUNCTION ONCE WHEN THE COMPONENT RENDERS
    useEffect(() => {
        // NOTE: CHECKING LOCAL STORAGE TO CHECK IF USER IS LOGGED IN
        const user = JSON.parse(localStorage.getItem('user'))

        // NOTE: CHECKING IF USER IS NOT NULL
        if (user) {
            // NOTE: IF USER IS IN LOCAL STORAGE => DISPATCH A LOGIN ACTION
            dispatch({type: 'LOGIN', payload: user})
        }
    }, [])

    // KEEP TRACK FOR DEVELOPMENT
    // DEBUG: console.log('AuthContext state: ', state)

    // WRAPPING THE 'CHILDREN' (APP COMPONENT) IN THE "AuthContext.Provider" COMPONENT
    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

// END OF DOCUMENT --------------------------------------------------------------------------------