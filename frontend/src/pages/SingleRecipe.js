// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCommunitySwitch from '../components/RecipeCommunitySwitch';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';

const SingleRecipe = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: STATE VARIABLES
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null)
    const { user } = useAuthContext()
    const params = window.location.href
    const urlname = 'http://localhost:4000/recipes/' + params.split('/').reverse()[0]
    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null)
    const [message, setMessage] = useState(null)

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

    // NOTE: ADD RATING ---------------------------------------------------------------------------
    const handleRating = async () => {
        if (user) {
            console.log(rating)
            await axios.post(`${urlname}/rating`, {
                rating: rating
            }, { 
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } 
            })
            .then((response) => {
                if(response.ok) {
                    console.log(response.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            // TODO: ADD MESSAGE AND REDIRECT AFTER 2 Seconds
            setMessage('You need to login to use this functionality!')
            setTimeout(() => navigate('/login'), 3000)
        }
    }

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
                        <div className='rating-container'>
                            <h3>Rate the recipe</h3>
                            {user 
                                ?
                                Array.from({length: 5 }, (_, i) => {
                                    const currentRating = i + 1

                                    return (
                                        <label>
                                            <input 
                                                type='radio'
                                                name='rating'
                                                value={currentRating}
                                                onClick={() => setRating(currentRating)}
                                            />
                                            <i 
                                                className='fas fa-star' 
                                                id='start' 
                                                style={{color: currentRating <= (hover || rating) ? "#ff7800" : "#d2d2d2"}}
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(null)}
                                            ></i>
                                        </label>
                                    )
                                })
                                :
                                <p>Please log in to rate the recipes</p>
                            }
                            <br></br>
                            {user && <button className='btn' onClick={handleRating}>Submit Rating</button>}
                        </div>
                        {user && (
                            <button className='suggestion-btn' onClick={toSuggestion}><i className="fas fa-clone" id='edit-button'></i> Suggest variation</button>
                        )}
                    </div>
                </div>
                :
                <p>No recipe found</p>
                
            }
        </div>
    )
}

export default SingleRecipe