// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCommunitySwitch from '../components/RecipeCommunitySwitch';

const SingleRecipe = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: STATE VARIABLES
    const navigate = useNavigate();
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
                    console.log(json)
                }
            } catch (err) {
                console.log(err)
            }
            
        }
        
        fetchRecipe()
    }, [])

    const toSuggestion = () => {
        navigate('suggest-variation')
    }

    return (
        <div className='recipe-discussion-box'>
            {recipe
                ? 
                <div className='single-recipe-page'>
                    <RecipeCommunitySwitch key={recipe._id} recipe={recipe} active={'recipe'}/>
                    <div className='single-recipe'>
                        <div className='single-recipe-middle'>
                            <div className='single-recipe-img'>
                                {recipe.image
                                    ? <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
                                    : <img src='ED2_LOGOV5.png' />
                                }
                            </div>
                            <div className='single-recipe-info'>
                                <h1>{recipe.title}</h1>
                                <span className='hr'></span>
                                <div className='quick-info'>
                                    <p>
                                        <b><i className='fa fa-clock'></i></b>
                                        {recipe.prepTime + recipe.cookTime} min
                                    </p>
                                    <p>
                                        <b><i className="fa-solid fa-chart-simple"></i></b> 
                                        {recipe.difficulty}
                                    </p>
                                    <p>
                                        <b><i className="fa-solid fa-kitchen-set"></i></b> 
                                        {recipe.servingSize} serving/s
                                    </p>
                                    <p>
                                        <b><i className="fa-solid fa-earth-americas"></i></b>
                                         {recipe.origin}
                                    </p>
                                    <p>
                                        <b><i className="fa-solid fa-bowl-food"></i></b>
                                         {recipe.mealType}
                                    </p>
                                </div>
                                <span className='hr'></span>
                                <table>
                                    <tr>
                                        <th colSpan={3}>Ingredients</th> 
                                    </tr>
                                    {recipe.ingredients.map((ingredient) => (
                                        <tr>
                                            <td>{ingredient.ingredient}</td>
                                            <td>{ingredient.quantity}</td> 
                                            <td>{ingredient.measurement}</td>                                              
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        </div>
                        <div className='instruction-container'>
                            <div className='instructions'>
                                <h3>Preparation Instructions:</h3>
                                <ol>
                                    {recipe.prepInstructions.map((inst) => (
                                        <li>{inst}</li>
                                    ))}
                                </ol>     
                            </div>
                            <div className='instructions'>
                                <h3>Cooking Instructions:</h3>
                                <ol>
                                    {recipe.cookInstructions.map((inst) => (
                                        <li>{inst}</li>
                                    ))}
                                </ol> 
                            </div>                                                        
                        </div>
                        <h3>Nutritional Info per Serving</h3> 
                        <div className='nutri-info'>      
                            <div className='nutri-card'>
                            <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalKcal}g</p>  
                                </div>  
                                <div className='nutri-details'>
                                    <p>Calories</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                            <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalCarbs}g</p>  
                                </div>  
                                <div className='nutri-details'>
                                    <p>Carbs</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                                <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalFat}g</p>  
                                </div>                              
                                <div className='nutri-details'>
                                    <p>Fat</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                            <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalProtein}g</p>  
                                </div>                                 
                                <div className='nutri-details'>
                                    <p>Protein</p>
                                </div>
                            </div>
                        </div>
                        <button className='suggestion-btn' onClick={toSuggestion}><i className="fas fa-clone" id='edit-button'></i> Suggest variation</button>
                    </div>
                </div>
                :
                <p>No recipe found</p>
                
            }
        </div>
    )
}

export default SingleRecipe