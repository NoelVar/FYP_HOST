// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect } from 'react';
import RecipeCommunitySwitch from '../components/RecipeCommunitySwitch';

const SingleRecipe = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: STATE VARIABLES
    const [recipe, setRecipe] = useState(null)
    const params = window.location.href
    const urlname = 'http://localhost:4000/recipes/' + params.split('/').reverse()[0]

    useEffect(() => {
        // NOTE: FETCHING THE RECIPE FROM THE SERVER
        const fetchRecipe = async () => {
            try {
                const response = await fetch(urlname)
                const json = await response.json()

                if (response.ok) {
                    setRecipe(json)
                }
            } catch (err) {
                console.log(err)
            }
            
        }
        
        fetchRecipe()
    }, [])

    return (
        <div className='single-recipe'>
            {recipe
                ? 
                <div className='single-recipe-details'>
                    <RecipeCommunitySwitch key={recipe._id} recipe={recipe} active={'recipe'}/>
                    <div className='information'>
                        <h1>{recipe.title}</h1>
                        <div className='single-recipe-middle'>
                            {recipe.image
                                ? <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
                                : <img src='ED2_LOGOV5.png' />
                            }
                            <div className='single-recipe-info'>
                                <p><b>Time:</b> Preparation: {recipe.prepTime} minute, Cooking: {recipe.cookTime} minute</p>
                                <p><b>Difficulty:</b> {recipe.difficulty}</p>
                                <div><b>Ingredients: </b> 
                                    {recipe.ingredients.map((ingredient) => (
                                        ingredient.quantity + ' ' + ingredient.measurement + ' ' + ingredient.ingredient + ", "
                                    ))}
                                </div>
                                <p><b>Serving Size:</b> {recipe.servingSize}</p>
                                <p><b>Preparation:</b> {recipe.origin}</p>
                                <p><b>Meal type:</b> {recipe.mealType}</p>
                            </div>
                        </div>
                        <p><b>Preparation Instructions:</b> {recipe.prepInstructions}</p>
                        <p><b>Cooking Instructions:</b> {recipe.cookIntructions}</p>
                        <div><b>Nutritional Info: </b> 
                            {recipe.nutritionalInfo.totalKcal + 'Kcal, ' + recipe.nutritionalInfo.totalCarbs + ' carbs, ' + recipe.nutritionalInfo.totalFat + ' fat, ' + recipe.nutritionalInfo.totalProtein + " protein"}
                        </div>
                    </div>
                </div>
                :
                <p>No recipe found</p>
                
            }
        </div>
    )
}

export default SingleRecipe