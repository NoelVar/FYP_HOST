// ADAPTED FROM :https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { createContext, useReducer} from 'react';

// CREATING CONTEXT
export const RecipeContext = createContext()

// TAKES IN PREVIOUS STATE AND ACTION
export const recipesReducer = (state, action) => {
    switch (action.type) {
        // INITIALIZING RECIPES
        case 'SET_RECIPES': 
            // THE RECIPE IS WHAT THE SERVER SENDS BACK
            return { recipes: action.payload }
        // DELETING RECIPE ACTION
        case 'DELETE_RECIPE':
            // Filter out the deleted recipe by comparing IDs
            return { 
                recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id)
            }
        // UPDATING RECIPE STATUS ACTION
        case 'UPDATE_RECIPE':
            // Filter out the deleted recipe by comparing IDs
            var recipeArray = []
            state.recipes.filter((recipe) => {
                if (recipe._id === action.payload._id) {
                    recipeArray.push(action.payload)
                }
                else {
                    recipeArray.push(recipe)
                } 
            })
            return {...state, recipes: recipeArray}
        default:
            // NO CHANGE RETURN ORIGINAL STATE
            return state
    }
}

// CUSTOM COMPONENT
export const RecipeContextProvider = ({ children }) => { // CHILDREN REPRESENTS WHATEVER THE COMPONENT WRAPS
    const [state, dispatch] = useReducer(recipesReducer, {
        recipes: null
    })

    // WRAPPING THE 'CHILDREN' (APP COMPONENT) IN THE "RecipeContext.Provider" COMPONENT
    return(
        <RecipeContext.Provider value={{...state, dispatch}}>
            { children }
        </RecipeContext.Provider>
    )
}