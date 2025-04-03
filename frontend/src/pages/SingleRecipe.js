// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCommunitySwitch from '../components/RecipeCommunitySwitch';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import Footer from '../components/Footer';

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
    const [posted, setPostedBy] = useState(null)
    const [avarageRating, setAvarageRating] = useState(null)
    const [roundedRating, setRoundedRating] = useState(null)
    const [variations, setVariations] = useState(null)

    useEffect(() => {
        var singleRecipe
        // NOTE: FETCHING THE RECIPE FROM THE SERVER
        const fetchRecipe = async () => {
            try {
                const response = await fetch(urlname)
                const json = await response.json()

                if (response.ok) {
                    singleRecipe = json
                    setRecipe(json)
                }
            } catch (err) {
                console.log(err)
            }
            
        }

        const fetchRecipes = async () => {
            // console.log(BACKEND)
            const response = await fetch('http://localhost:4000/recipes') // FIXME: REMOVE FULL URL
            const json = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (response.ok) {
                const recipeArray = []
                // CHECKS ALL RECIPES IF THE RECIPES STATUS IS NOT DENIED
                for (var i = 0; i < json.length; i++) {
                    if (singleRecipe && json[i].approvalStatus !== 'denied' && json[i].variationOfRecipe.recipe === singleRecipe._id) {
                        recipeArray.push(json[i])
                    }
                }
                if (recipeArray.length !== 0) {
                    setVariations(recipeArray)
                }
            }
        }
        
        fetchRecipe()
        fetchRecipes()
    }, [])

    // NOTE: FUNCTION TO RETRIEVE USERNAMES -------------------------------------------------------
    const fetchUser = async (userId) => {
        try {
            const response = await fetch('http://localhost:4000/user/single-user-id', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ id: userId })
            });
            const json = await response.json();

            if (response.ok) {
                // ADDS USERNAME TO 'setPostedBy' STATE OBJECT
                setPostedBy(json)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (recipe && recipe.postedBy) {
            // FINDING THE USER WHO POSTED THE RECIPE
            fetchUser(recipe.postedBy)

            var totalRating = 0
            // CALCULATING TOTAL RATING FOR RECIPE
            for (var i = 0; recipe.rating.length > i; i++) {
                totalRating += recipe.rating[i].value
            }

            // CALCULATING AVARAGE RATING
            var avarage = totalRating/recipe.rating.length
            // ROUNDING AVARAGE RATING
            setAvarageRating(avarage)
            setRoundedRating(Math.round(avarage))
        }

    }, [recipe])

    // NOTE: ADD RATING ---------------------------------------------------------------------------
    const handleRating = async () => {
        if (user) {
            await axios.post(`${urlname}/rating`, {
                value: rating,
                email: user.email
            }, { 
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } 
            })
            .then((response) => {
                // SETTING MESSAGE FOR USER
                if(response.status === 200 || response.status === 201) {
                    setMessage(response.data.message)
                }
            })
            .catch((err) => {
                setMessage(err)
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
                                    : <img src='ED2_LOGOV5.png' alt='Recipe cover'/>
                                }
                            </div>
                            <div className='single-recipe-info'>
                                <h1>{recipe.title}</h1>
                                <span className='poster'><b>Posted By:</b> {posted}</span>
                                <div className='avarage-rating-container'>
                                    <h4>Rating: </h4>
                                    <p>{avarageRating && avarageRating.toFixed(1)}</p>
                                    <div className='star-container'>
                                        {Array.from({ length: 5 }, (_, i) => 
                                            <i 
                                            className='fas fa-star'
                                            id='avarage-rating'
                                            style={{color: roundedRating > i ? "#ff7800" : "#d2d2d2"}}
                                            ></i>
                                        )}
                                    </div>
                                    <span>({recipe.rating.length})</span>
                                </div>
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
                            <h3>Rate Recipe</h3>
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
                            {message && <p>{message}</p>}
                            {user && <button className='btn' onClick={handleRating}>Submit Rating</button>}
                        </div>
                        {variations &&
                            <div className='variation-box'>
                                <h3>Variations of {recipe.title}</h3>
                                <div className='variation-container'>
                                    {variations.map((variation) => {
                                        const url = '/recipes/' + variation._id
                                        return (
                                            <Link to={url} onClick={() => {window.location.href=url}} className='variation-card'>
                                                {variation.image
                                                    ? <img src={`http://localhost:4000/images/` + variation.image} alt='Recipe cover' />
                                                    : <img src='../ED2_LOGOV5.png' alt='Coulnt find img' />
                                                }
                                                <p>{variation.title}</p>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        {user && (
                            <button className='suggestion-btn' onClick={toSuggestion}><i className="fas fa-clone" id='edit-button'></i> Suggest variation</button>
                        )}
                    </div>
                </div>
                :
                <p>No recipe found</p>
                
            }
            <Footer />
        </div>
    )
}

export default SingleRecipe