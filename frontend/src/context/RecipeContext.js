// ADAPTED FROM :https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { createContext, useReducer} from 'react';

// CREATING CONTEXT
export const RecipeContext = createContext()

// TAKES IN PREVIOUS STATE AND ACTION
export const recipesReducer = (state, action) => {
    switch (action.type) {
        // INITIALIZING RECIPES
        case 'SET_RECIPES': 
            return { ...state, recipes: action.payload }
        // ADDING RECIPES
        case 'ADD_RECIPES':
            return { ...state, recipes: [...state.recipes, action.payload] }
        // DELETING RECIPE ACTION
        case 'DELETE_RECIPE':
            return { 
                ...state,
                recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id)
            }
        // UPDATING RECIPE STATUS ACTION
        case 'UPDATE_RECIPE':
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
        // SETTING COMMENTS
        case 'SET_COMMENTS':
            return { ...state, comments: action.payload }
        // ADDING COMMENT
        case 'ADD_COMMENT':
            return { ...state, comments: [...state.comments, action.payload] }
        // DELETING COMMENT
        case 'DELETE_COMMENT':
            return { 
                ...state, 
                comments: state.comments.filter((comment) => comment._id !== action.payload._id)
            }
        default:
            // NO CHANGE RETURN ORIGINAL STATE
            return state
    }
}

// CUSTOM COMPONENT
export const RecipeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(recipesReducer, {
        recipes: null,
        comments: null
    })

    // WRAPPING THE 'CHILDREN' (APP COMPONENT) IN THE "RecipeContext.Provider" COMPONENT
    return(
        <RecipeContext.Provider value={{...state, dispatch}}>
            { children }
        </RecipeContext.Provider>
    )
}