// ADAPTED FROM :https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { createContext, useReducer, useEffect} from 'react';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': 
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
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

    console.log('AuthContext state: ', state)

    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}