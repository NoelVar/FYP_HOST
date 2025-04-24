// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const UpdateOwnedRecipe = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [title, setTitle] = useState('')
    const [file, setFile] = useState(null)
    const [prepTime, setPrepTime] = useState(0)
    const [cookTime, setCookTime] = useState(0)
    const [difficulty, setDifficulty] = useState('')
    const [serving, setServing] = useState(0)
    const [origin, setOrigin] = useState('')
    const [mealType, setMealType] = useState('')
    const [newPrepInst, setNewPrepInst] = useState('')
    const [prepInst, setPrepInstructions] = useState([])
    const [newCookInst, setNewCookInst] = useState('')
    const [cookInst, setCookInstructions] = useState([])
    const [singleIngredient, setSingleIngredient] = useState({
        ingredient: '',
        quantity: 0,
        measurement: ''
    });
    const [nutrInfo, setNutrInfo] = useState({
        totalKcal: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalProtein: 0
    });
    const params = window.location.href
    const urlname = 'https://edibleeducation-backend.up.railway.app/recipes/' + params.split('/').reverse()[1]
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const { user } = useAuthContext()

    useEffect(() => {
        // NOTE: FETCHING THE RECIPE FROM THE SERVER
        const fetchRecipe = async () => {
            try {
                const response = await fetch(urlname)
                const json = await response.json()

                if (response.ok) {
                    setRecipe(json)
                    setIngredients(json.ingredients)
                    setPrepInstructions(json.prepInstructions)
                    setCookInstructions(json.cookInstructions)
                }
            } catch (err) {
                console.log(err)
            }
            
        }
        
        fetchRecipe()
    }, [])

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: HANLDING DELETING LIST ITEM ----------------------------------------------------------
    const handleDelete = (e, index, type) => {
        e.preventDefault()
        if (type === 'prep') {
            setPrepInstructions(prepInst.filter((inst, i) => { 
                setMessage("Item removed successfully!")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                return i !== index
            }))
        } else if (type === 'cook') {
            setCookInstructions(cookInst.filter((inst, i) => { 
                setMessage("Item removed successfully!")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                return i !== index
            }))
        } else if (type === 'ingredient') {
            setIngredients(ingredients.filter((ingredient, i) => {
                setMessage("Item removed successfully!")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                return i !== index
            }))
        }
    }

    // NOTE: HANDLING DIFFICULTY CHANGE -----------------------------------------------------------
    const handleDifficultyChange = (e) => {
        e.preventDefault()
        setDifficulty(e.target.value)
    }

    // NOTE: HANDLING ADDING NEW LIST ITEM -------------------------------------------------------
    const handleInput = (e, type) => {
        e.preventDefault()
        if (type === 'prep') {
            prepInst.push(newPrepInst)
            setNewPrepInst('')
            setMessage("Item added successfully!")
            setTimeout(() => {
                setMessage(null)
            }, 4000)

        } else if (type === 'cook') {
            cookInst.push(newCookInst)
            setNewCookInst('')
            setMessage("Item added successfully!")
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        }
    }

    // NOTE: HANDLING ADDED NUTRINFO --------------------------------------------------------------
    const handleNutrition = (e) => {
        e.preventDefault()
        setNutrInfo({...nutrInfo, [e.target.name]: e.target.value})
    }

    // NOTE: HANDLING ADDED INGREDIENT ------------------------------------------------------------
    const handleNewIngredient = (e) => {
        e.preventDefault()
        setSingleIngredient({...singleIngredient, [e.target.name]: e.target.value})
    }

    // NOTE: ADDING SINGLE INGREDIENT TO LIST OF INGREDIENTS --------------------------------------
    const addIngredient = (e) => {
        e.preventDefault()
        setIngredients([singleIngredient, ...ingredients])
        setMessage("Ingredient has been added!")
        setTimeout(() => {
            setMessage(null)
        }, 4000)
    }

    // NOTE: FUNCTION TO HANDLE THE SUBMITION ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user) {
                    
            var updatedTitle = recipe.title
            var updatedPrepTime = recipe.prepTime
            var updatedCookTime = recipe.cookTime
            var updatedServingSize = recipe.servingSize
            var updatedDifficulty = recipe.difficulty
            var updatedOrigin = recipe.origin
            var updatedMealType = recipe.mealType
            var updatedPrepInst = prepInst
            var updatedCookInst = cookInst
            var updatedIngred = ingredients
            var updatedNuri = recipe.nutritionalInfo

            // NOTE: CHECKING IF USER ENTERED ANY VALUES
            // IF THE USER DID, IT WILL BE SENT BACK INSTEAD OF THE ORIGINAL DATA
            if (title !== '') {
                updatedTitle = title
            }

            if (serving !== 0) {
                updatedServingSize = serving
            }

            if (difficulty !== '') {
                updatedDifficulty = difficulty
            }

            if (origin !== '') {
                updatedOrigin = origin
            }

            if (mealType !== '') {
                updatedMealType = mealType
            }

            if (prepTime !== 0) {
                updatedPrepTime = prepTime
            }

            if (cookTime !== 0) {
                updatedCookTime = cookTime
            }

            if (nutrInfo.totalKcal !== 0) {
                updatedNuri.totalKcal = nutrInfo.totalKcal
            }

            if (nutrInfo.totalCarbs !== 0) {
                updatedNuri.totalCarbs = nutrInfo.totalCarbs
            }

            if (nutrInfo.totalFat !== 0) {
                updatedNuri.totalFat = nutrInfo.totalFat
            }   

            if (nutrInfo.totalProtein !== 0) {
                updatedNuri.totalProtein = nutrInfo.totalProtein  
            }

            const email = user.email
            
            //NOTE: CREATING A FORM DATA OBJECT TO INCLUDE FILES
            const formData = new FormData();
            
            // Add all fields to FormData
            formData.append('title', updatedTitle);
            if (file) {
                formData.append('file', file);
            }
            formData.append('prepTime', updatedPrepTime);
            formData.append('cookTime', updatedCookTime);
            formData.append('servingSize', updatedServingSize);
            formData.append('difficulty', updatedDifficulty);
            formData.append('origin', updatedOrigin);
            formData.append('mealType', updatedMealType);
            formData.append('prepInstructions', JSON.stringify(updatedPrepInst));
            formData.append('cookInstructions', JSON.stringify(updatedCookInst));
            formData.append('ingredients', JSON.stringify(updatedIngred));
            formData.append('nutrInfo', JSON.stringify(updatedNuri));
            formData.append('email', email);

            // NOTE: SENDING THE RECIPE TO THE SERVER IF THE USER HAS MADE A CHANGE
            try {
                const response = await fetch('https://edibleeducation-backend.up.railway.app/recipes/' +  params.split('/').reverse()[1] + '/update', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    },
                    method: 'PATCH',
                    body: formData,
                });

                const json = await response.json();

                if (!response.ok) {
                    setError(json.error || 'Failed to update recipe')
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                    return
                }

                if (response.ok) {
                    setMessage(json.message)
                    setTimeout(() => {
                        setMessage(null)
                    }, 4000)
                    setTimeout(() => {
                        navigate('/my-profile')
                    }, 2000)
                }

            } catch (error) {
                setError('An error occurred while updating the recipe')
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        }
    }

    return (
        <div className='recipe-discussion-box'>
        {recipe
            ? 
            <div className='single-recipe-page'>
                <form>
                    <div className='important-info'>
                        <i className='fas fa-circle-info'></i>
                        <p>Add your changes to the "{recipe.title}" recipe and update it!</p>
                        <p>Note: Only fill in the fields that you would like to make a change to, otherwise leave the fields empty to keep the original information.</p>
                    </div>
                    <div className='single-recipe'>
                        <div className='single-recipe-middle'>
                            <div className="single-input">
                                <label>Cover Image: </label>
                                <label htmlFor="file" className="file-input">
                                    {file ? (
                                        <div>
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt="Preview"
                                            />
                                            <p>Change Image</p>
                                        </div>
                                    ) : (
                                        <p>Browse and upload your image +</p>
                                    )}
                                </label>
                                <input 
                                    type="file"
                                    id="file"
                                    accept=".png, .jpg, .jpeg"
                                    name="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                            <div className='single-recipe-info'>
                                <h1>{recipe.title} - 
                                    <input 
                                        type='text'
                                        placeholder='*Update title...'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </h1>
                                <span className='hr'></span>
                                <form>
                                <div className='quick-info'>
                                    <div className='edit-quick-info'>
                                        <p>
                                            <b><i className='fa fa-clock'></i></b>
                                            {recipe.prepTime + recipe.cookTime} min
                                        </p>
                                        <input 
                                            type='number'
                                            min="0"
                                            placeholder='Change prep time...'
                                            value={prepTime}
                                            onChange={(e) => setPrepTime(e.target.value)}
                                        />
                                    </div>
                                    <div className='edit-quick-info'>
                                        <p>
                                            <b><i className="fa-solid fa-chart-simple"></i></b> 
                                            {recipe.difficulty}
                                        </p>      
                                        <label>Difficulty: <span className="required">*</span></label>
                                        <select onChange={(e) => handleDifficultyChange(e)}>
                                            <option value="none" selected disabled hidden>Select a difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <div className='edit-quick-info'>
                                        <p>
                                            <b><i className="fa-solid fa-kitchen-set"></i></b> 
                                            {recipe.servingSize} serving/s
                                        </p>
                                        <input 
                                            type='number'
                                            min="0"
                                            placeholder='Change serving size...'
                                            value={serving}
                                            onChange={(e) => setServing(e.target.value)}
                                        />
                                    </div>
                                    <div className='edit-quick-info'>
                                        <p>
                                            <b><i className="fa-solid fa-earth-americas"></i></b>
                                            {recipe.origin}
                                        </p>
                                        <input 
                                            type='text'
                                            placeholder='Change origin...'
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                        />
                                    </div>
                                    <div className='edit-quick-info'>
                                        <p>
                                            <b><i className="fa-solid fa-bowl-food"></i></b>
                                            {recipe.mealType}
                                        </p>
                                        <select onChange={(e) => setMealType(e.target.value)}>
                                            <option value="none" selected disabled hidden>Select a meal type</option>
                                            <option value="breakfast">Breakfast</option>
                                            <option value="brunch">Brunch</option>
                                            <option value="lunch">Lunch</option>
                                            <option value="dinner">Dinner</option>
                                            <option value="dish">Dish</option>
                                            <option value="snack">Snack</option>
                                            <option value="drink">Drink</option>
                                            <option value="dessert">Dessert</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                </form>
                                <span className='hr'></span>
                                <table>
                                    <tr>
                                        <th colSpan={4}>Ingredients</th> 
                                    </tr>
                                    {ingredients.map((ingredient, i) => (
                                        <tr>  
                                            <td>{ingredient.ingredient}</td>
                                            <td>{ingredient.quantity}</td> 
                                            <td>{ingredient.measurement}</td>
                                            <td><button className='delete-btn' onClick={(e) => handleDelete(e, i, 'ingredient')}><i className='fas fa-trash'></i></button></td>
                                        </tr>
                                    ))}                                                               
                                </table>
                                <div className='add-ingredient-form'>
                                    <input 
                                        type="text" 
                                        id="inputItem"
                                        name="ingredient"
                                        placeholder="Enter an ingredient..."
                                        onChange={handleNewIngredient}
                                        required
                                    />

                                    <input 
                                        type="number" 
                                        min="0"
                                        id="inputItem"
                                        name="quantity"
                                        placeholder="Enter the quantity..."
                                        onChange={handleNewIngredient}
                                    />
                                    <input 
                                        type="text"
                                        id="inputItem"
                                        name="measurement"
                                        placeholder="Enter the measurement..."
                                        onChange={handleNewIngredient}
                                    />
                                    <button onClick={addIngredient}>Add Ingredient</button>
                                </div> 
                            </div>
                        </div>
                        <div className='instruction-container'>
                            <div className='instructions'>
                                <h3>Preparation Instructions:</h3>
                                <ol>
                                    {prepInst.map((inst, i) => (
                                        <li>{inst} <button className='delete-btn' onClick={(e) => handleDelete(e, i, 'prep')}><i className='fas fa-trash'></i></button></li>
                                    ))}
                                    <input 
                                        type='text'
                                        placeholder='Add new instruction...'
                                        onChange={(e) => setNewPrepInst(e.target.value)}
                                        value={newPrepInst}
                                    />
                                    <button onClick={(e) => handleInput(e, 'prep')}>+ add new instruction</button>
                                </ol>     
                            </div>
                            <div className='instructions'>
                                <h3>Cooking Instructions:</h3>
                                <ol>
                                    {cookInst.map((inst, i) => (
                                        <li>{inst} <button className='delete-btn' onClick={(e) => handleDelete(e, i, 'cook')}><i className='fas fa-trash'></i></button></li>
                                    ))}
                                    <input 
                                        type='text'
                                        placeholder='Add new instruction...'
                                        onChange={(e) => setNewCookInst(e.target.value)}
                                        value={newCookInst}
                                    />
                                    <button onClick={(e) => handleInput(e, 'cook')}>+ add new instruction</button>
                                </ol> 
                            </div>                                                         
                        </div>
                        <h3>Nutritional Info per Serving</h3> 
                        <div className='nutri-info'>      
                            <div className='nutri-card'>
                                <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalKcal}g</p>  
                                    <input 
                                        type='number'
                                        min="0"
                                        name='totalKcal'
                                        placeholder='Add new total kcal...'
                                        onChange={handleNutrition}
                                    />
                                </div>  
                                <div className='nutri-details'>
                                    <p>Calories</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                                <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalCarbs}g</p>  
                                    <input 
                                        type='number'
                                        min="0"
                                        name='totalCarbs'
                                        placeholder='Add new total carbs...'
                                        onChange={handleNutrition}
                                    />
                                </div>  
                                <div className='nutri-details'>
                                    <p>Carbs</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                                <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalFat}g</p> 
                                    <input 
                                        type='number'
                                        min="0"
                                        name='totalFat'
                                        placeholder='Add new total fats...'
                                        onChange={handleNutrition}
                                    /> 
                                </div>                              
                                <div className='nutri-details'>
                                    <p>Fat</p>
                                </div>
                            </div>
                            <div className='nutri-card'>
                            <div className='nutri-amount'>
                                    <p>{recipe.nutritionalInfo.totalProtein}g</p> 
                                    <input 
                                        type='number'
                                        min="0"
                                        name='totalProtein'
                                        placeholder='Add new total protein...'
                                        onChange={handleNutrition}
                                    /> 
                                </div>                                 
                                <div className='nutri-details'>
                                    <p>Protein</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='submit-btn-container'>
                        <button className='submit-btn' onClick={handleSubmit}>Update Recipe</button>
                    </div>
                </form>
            </div>
            :
            <p>No recipe found</p>
            
        }
        {error &&
            <div className="alert-error">
                <p>{error}</p>
            </div>
        }
        {message &&
            <div className="alert-message">
                <p>{message}</p>
            </div>  
        }
    </div>
    )
}

export default UpdateOwnedRecipe

// END OF DOCUMENT --------------------------------------------------------------------------------