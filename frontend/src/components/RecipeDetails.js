// IMPORTS ----------------------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';

// NOTE: RECIPE DETAILS ---------------------------------------------------------------------------
const RecipeDetails = ({ recipe, role}) => {

    // NOTE: URL 
    const urlName = '/recipes/' + recipe._id

    // VARIABLE TO STORE LOGGED IN USER
    const [hasVariation, setHasVariation] = useState(false)

    // RETRIEVING RECIPES ON LOAD
    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('https://edibleeducation-backend.up.railway.app/recipes')
            const json = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (response.ok) {
                const recipeArray = []
                // CHECKS ALL RECIPES IF THE RECIPES STATUS IS NOT DENIED OR PENDING
                for (var i = 0; i < json.length; i++) {
                    if (recipe && json[i].approvalStatus === 'approved' && json[i].variationOfRecipe.recipe === recipe._id) {
                        recipeArray.push(json[i])
                    }
                }
                if (recipeArray.length !== 0) {
                    setHasVariation(true)
                }
            }
        }

        fetchRecipes()
    }, [])

    // NOTE: RETURNING INDIVIDUAL RECIPE DETAILS --------------------------------------------------
    return (
        <div className="recipe-details">
            <Link to={urlName.toLowerCase()}>
                {recipe.image
                    ? <img src={`https://edibleeducation-backend.up.railway.app/images/` + recipe.image} alt='Recipe cover' />
                    : <img src='ED2_LOGOV5.png' />
                }
                <div className="recipe-info">
                    <h2>{recipe.title}</h2>
                    <table className='recipe-first-detail'>
                        <tr>
                            <td><i className="fa-regular fa-clock"></i> </td>
                            <td>{recipe.prepTime + recipe.cookTime} minutes</td>
                            {recipe && hasVariation === true &&
                                <td className='variation-symbol' rowSpan={3}><img src='../ED2_LOGOV6.png' alt='Has variations'></img></td>
                            }
                        </tr>
                        <tr>
                            <td><i className="fa-solid fa-bowl-food"></i></td>
                            <td>{recipe.servingSize} servings</td>
                        </tr>
                        <tr>
                            <td><i className="fa-solid fa-kitchen-set"></i></td>
                            <td>{recipe.difficulty}</td>
                        </tr>
                    </table>
                </div>
            </Link>
        </div>
    )
}

export default RecipeDetails

// END OF DOCUMENT --------------------------------------------------------------------------------