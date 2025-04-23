// ADAPTED FROM: https://www.youtube.com/watch?v=64RiVcXhxN0&list=PL4cUxeGkcC9g8OhpOZxNdhXggFz2lOuCT&index=8
import { RecipeContext } from "../context/RecipeContext";
import { useContext } from "react";

export const useRecipeContext = () => {
    // CONSUME RECIPE CONTEXT
    const context = useContext(RecipeContext)

    // CHECKING IF 'context' IS NOT USED OUTSIDE OF SCOPE (APP)
    if (!context) {
        throw Error('useRecipeContext must be used inside an RecipeContextProvider')
    }

    // RETURNS CONTEXT
    return context
}

// END OF DOCUMENT --------------------------------------------------------------------------------