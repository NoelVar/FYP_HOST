// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

    /* TODO: - REMOVE CAPITAL LETTER WHEN SAVING
             - STYLE PAGE
             - ADD ALL INGREDIENT DISPLAY BASED ON INGREDIENT NAMES (IF MATCHES DONT ADD TO LIST)
    */

// NOTE: CREATE NEW RECIPE ------------------------------------------------------------------------
const CreateNewRecipe = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: USE STATES ---------------------------------------------------------------------------
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState()
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [serving, setServingSize] = useState(0);
    const [difficulty, setDifficulty] = useState('');
    const [origin, setOrigin] = useState('');
    const [mealType, setMealType] = useState('');
    const [prepStep, setPrepStep] = useState('');
    const [prepInst, setPrepInst] = useState([]);
    const [cookingStep, setCookingStep] = useState('');
    const [cookInst, setCookInst] = useState([]);
    const [singleIngredient, setSingleIngredient] = useState({
            ingredient: '',
            quantity: 0,
            measurement: ''
    });
    const [ingredients, setIngredients] = useState([]);
    const [nutrInfo, setNutrInfo] = useState({
        totalKcal: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalProtein: 0
    });
    const [error, setError] = useState('')
    const { user } = useAuthContext()
    
    // NOTE: HANDLING OPTION CHANGE ---------------------------------------------------------------
    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value)
    }

    const handleMealChange = (e) => {
        setMealType(e.target.value)
    }

    // NOTE: HANDLING ADDED INGREDIENT ------------------------------------------------------------
    // ADAPTED FROM: https://dev.to/yosraskhiri/how-to-upload-an-image-using-mern-stack-1j95
    const handleNewIngredient = (e) => {
        e.preventDefault()
        setSingleIngredient({...singleIngredient, [e.target.name]: e.target.value})
    }

    // NOTE: HANDLING COOKING INSTRUCTIONS --------------------------------------------------------
    const handleCookInst = (e) => {
        e.preventDefault()
        setCookInst([...cookInst, cookingStep])
    }

    // NOTE: HANDLING COOKING INSTRUCTIONS --------------------------------------------------------
    const handlePrepInst = (e) => {
        e.preventDefault()
        setPrepInst([...prepInst, prepStep])
    }

    // NOTE: HANDLING ADDED NUTRINFO --------------------------------------------------------------
    const handleNutrition = (e) => {
        e.preventDefault()
        setNutrInfo({...nutrInfo, [e.target.name]: e.target.value})
    }

    // NOTE: ADDING SINGLE INGREDIENT TO LIST OF INGREDIENTS --------------------------------------
    const addIngredient = (e) => {
        e.preventDefault()
        setIngredients([singleIngredient, ...ingredients])
    }

    // NOTE: REMOVING SINGLE INGREDIENT FROM LIST OF INGREDIENTS ----------------------------------
    const removeIngredient = (e, index) => {
        e.preventDefault()
        setIngredients(ingredients.filter((ing, i) => index !== i))
    }

    // NOTE: REMOVING SINGLE INSTRUCTION FROM LIST OF INSTRUCTIONS --------------------------------
    const removeInstruction = (e, index, type) => {
        e.preventDefault()
        if (type === 'prep') {
            setPrepInst(prepInst.filter((prep, i) => index !== i))
        } else if (type === 'cook') {
            setCookInst(cookInst.filter((cook, i) => index !== i))
        }
    }

    // NOTE: FUNCTION TO HANDLE THE SUBMITION ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const approvalStatus = 'pending';

        if (title === '' ||
            prepTime === 0 ||
            cookTime === 0 ||
            serving === 0 ||
            difficulty === '' ||
            origin === '' ||
            mealType === '' ||
            prepInst.length === 0 ||
            cookInst.length === 0 ||
            ingredients.length === 0
        ) {
            setError('Required fields cannot be empty!')
        }

        const email = user.email
        const variation = {
            status: false,
            recipe: null
        }

        //NOTE: CREATING A FORM DATA OBJECT TO INCLUDE FILES
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file); // NOTE: NAME NEEDS TO MATCH MULTER SET UP
        formData.append('prepTime', prepTime);
        formData.append('cookTime', cookTime);
        formData.append('servingSize', serving);
        formData.append('difficulty', difficulty);
        formData.append('origin', origin);
        formData.append('mealType', mealType);
        formData.append('prepInstructions', JSON.stringify(prepInst));
        formData.append('cookInstructions', JSON.stringify(cookInst));
        formData.append('ingredients', JSON.stringify(ingredients)); // NOTE: CONVERTE TO JSON STRING
        formData.append('nutrInfo', JSON.stringify(nutrInfo));
        formData.append('approvalStatus', approvalStatus);
        formData.append('email', email);
        formData.append('variation', JSON.stringify(variation))

        // CHECKING IF USER IS LOGGED IN
        if (user) {
            // NOTE: SENDING THE RECIPE TO THE SERVER AND THE AUTH TOKEN TO GET ACCESS TO THE ENDPOINT
            const response = await fetch('http://localhost:4000/recipes', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                method: 'POST',
                body: formData,
            });
            const json = await response.json();

            if (response.ok) {
                setTitle('')
                setFile()
                setPrepTime(0)
                setCookTime(0)
                setServingSize(0)
                setDifficulty('')
                setOrigin('')
                setMealType('')
                setPrepInst([])
                setCookInst([])
                setSingleIngredient([])
                setNutrInfo('')
                navigate('/recipes')
            } else {
                console.error('Server Error:', json.error)
            }
        }
    }

    // NOTE: DISPLAYING FORM ----------------------------------------------------------------------
    return (
        <div className="add-recipe-box">
            <form onSubmit={handleSubmit} className="add-recipe-form">
                <h1>Share your recipe with others!</h1>
                <div className='important-info'>
                    <i className='fas fa-circle-info'></i>
                    <p><b>Note:</b> All the fields that have a <span className="required">*</span> infront of them are required to fill in.</p>
                    <p>By submitting a recipe you agree to our <Link>Terms and conditions</Link></p>
                </div>
                <div className="basic-information">
                    <h2>Basic information</h2>
                    <p><b>Note:</b> Please fill in the basic information of your recipe and upload an image.</p>
                    <div className="basic-info-main">
                        <div className="basic-info-section1">
                            {/*NOTE: TITLE*/}
                            <div className="single-input">
                                <label>Title: <span className="required">*</span> </label>
                                <input 
                                    type="text"
                                    value={title}
                                    placeholder="Please enter the title of your recipe..."
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            {/*NOTE: IMAGE*/}
                            {/* ADAPTED FROM: https://dev.to/yosraskhiri/how-to-upload-an-image-using-mern-stack-1j95*/}
                            <div className="single-input">
                                <label>Cover Image: </label>
                                <label for="file" className="file-input">Browse and upload your image +</label>
                                <input 
                                    type="file"
                                    id="file"
                                    accept=".png, .jpg, .jpeg"
                                    name="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="basic-info-section2">
                            {/*NOTE: PREPARATION TIME*/}
                            <div className="single-input">
                                <label>Preparation Time: <span className="required">*</span> </label>
                                <input 
                                    type="number"
                                    value={prepTime}
                                    placeholder="Enter the amount of time it takes to prepare for the recipe..."
                                    onChange={(e) => setPrepTime(e.target.value)}
                                    required
                                />
                            </div>
                            {/*NOTE: COOK TIME*/}
                            <div className="single-input">
                                <label>Cooking Time: <span className="required">*</span> </label>
                                <input 
                                    type="number"
                                    value={cookTime}
                                    placeholder="Enter the amount of time it takes to cook the recipe..."
                                    onChange={(e) => setCookTime(e.target.value)}
                                    required
                                />
                            </div>
                            {/*NOTE: SERVING SIZE*/}
                            <div className="single-input">
                                <label>Serving Size: <span className="required">*</span> </label>
                                <input 
                                    type="number"
                                    value={serving}
                                    placeholder="Enter the number of people the recipe serves..."
                                    onChange={(e) => setServingSize(e.target.value)}
                                    required
                                />
                            </div>
                            {/*NOTE: DIFFICULTY*/}
                            {/* ADAPTED FROM: https://legacy.reactjs.org/docs/forms.html#the-select-tag */}
                            <div className="single-input">
                                <label>Difficulty level: <span className="required">*</span></label>
                                <select onChange={(e) => handleDifficultyChange(e)} required>
                                    <option value="none" selected disabled hidden>Select a difficulty</option>
                                    <option value="easy">Easy</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            {/*NOTE: ORIGIN OF DISH*/}
                            <div className="single-input">
                                <label>Dish Origin: <span className="required">*</span></label>
                                <input 
                                    type="text"
                                    value={origin}
                                    placeholder="Enter the origin country of your dish..."
                                    onChange={(e) => setOrigin(e.target.value)}
                                    required
                                />
                            </div>
                            {/*NOTE: MEAL TYPE*/}
                            <div className="single-input">
                                <label>Meal Type: <span className="required">*</span></label>
                                <select onChange={(e) => handleMealChange(e)} required>
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
                    </div>
                </div>
                <div className="basic-information">
                    {/*NOTE: INGREDIENTS*/}
                    {/* ADAPTED FROM: https://stackoverflow.com/questions/71880151/updating-an-array-with-usestate-in-a-form */}
                    <h2>Ingredients</h2>
                    <p><b>Note:</b> Enter ingredient informations, and add your ingredients one by one to your recipe</p>
                    <div className="add-ingredient">
                        <label>Ingredients: <span className="required">*</span></label>
                        <input 
                            type="text" 
                            id="inputItem"
                            name="ingredient"
                            placeholder="Enter the ingredients needed for the recipe..."
                            onChange={handleNewIngredient}
                            required
                        />
                        <label>Quantity: </label>
                        <input 
                            type="number" 
                            id="inputItem"
                            name="quantity"
                            placeholder="Enter the ingredient's quantity needed for the recipe..."
                            onChange={handleNewIngredient}
                        />
                        <label>Measurement: </label>
                        <input 
                            type="text"
                            id="inputItem"
                            name="measurement"
                            placeholder="Enter the measurement's type"
                            onChange={handleNewIngredient}
                        />
                        <button onClick={addIngredient}>Add Ingredient</button>
                    </div>
                    <div className="display-added">
                        {ingredients.map((ing, i) => (
                            <span className="added-ing">
                                {ing.ingredient}&nbsp;
                                <button className="delete-btn" onClick={(e) => removeIngredient(e, i)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="basic-information">
                    {/*NOTE: PREPARATION INSTRUCTIONS*/}
                    <h2>Preparation Instructions</h2>
                    <p><b>Note:</b> Enter your preparation instructions step by step, and add each step separately</p>
                    <div className="single-input">
                        <label className="instruction-label">Preparation Instructions: <span className="required">*</span></label>
                        <textarea                         
                            value={prepStep}
                            placeholder="Enter the preparation instructions step by step..."
                            onChange={(e) => setPrepStep(e.target.value)}
                            required
                        />
                        <button onClick={handlePrepInst} className="instruction-btn">Add step</button>
                    </div>
                    <ol>
                        <div className="added-instuction-box">
                            {Array.from({length: prepInst.length }, (_, i) =>
                                <span className="added-instruction">
                                    <li>{prepInst[i]}&nbsp;
                                        <button className="delete-btn" onClick={(e) => removeInstruction(e, i, 'prep')}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </li>
                                </span>
                            )}
                        </div>
                    </ol>
                </div>
                <div className="basic-information">
                    {/*NOTE: COOKING INSTRUCTIONS*/}
                    <h2>Cooking Instructions</h2>
                    <p><b>Note:</b> Enter your cooking instructions step by step, and add each step separately</p>
                    <div className="single-input">
                        <label className="instruction-label">Cooking Instructions: <span className="required">*</span></label>
                        <textarea
                            value={cookingStep}
                            placeholder="Enter the cooking instructions step by step..."
                            onChange={(e) => setCookingStep(e.target.value)}
                            required
                        />
                        <button onClick={handleCookInst} className="instruction-btn">Add step</button>
                    </div>
                    <ol>
                        <div className="added-instuction-box">
                            {Array.from({length: cookInst.length }, (_, i) =>
                                <span className="added-instruction">
                                    <li>{cookInst[i]}&nbsp;
                                        <button className="delete-btn" onClick={(e) => removeInstruction(e, i, 'cook')}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </li>
                                </span>
                            )}
                        </div>
                    </ol>
                </div>
                <div className="basic-information">
                    <h2>Nutritional information <span className="required">(Optional)</span></h2>
                    <p><b>Note:</b> Enter the nutritional information of the dish</p>
                    {/*NOTE: NUTRITIONAL INFO*/}
                    <div className="add-ingredient">
                        <label>Total Kcal: </label>
                        <input 
                            type="text" 
                            name="totalKcal"
                            placeholder="Enter total calories value..."
                            onChange={handleNutrition}
                        />
                        <label>Total Carbs: </label>
                        <input 
                            type="text" 
                            name="totalCarbs"
                            placeholder="Enter total carb value..."
                            onChange={handleNutrition}
                        />
                        <label>Total Fat: </label>
                        <input 
                            type="text" 
                            name="totalFat"
                            placeholder="Enter total fat value..."
                            onChange={handleNutrition}
                        />
                        <label>Total Protein: </label>
                        <input 
                            type="text" 
                            name="totalProtein"
                            placeholder="Enter total protein value..."
                            onChange={handleNutrition}
                        />
                    </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateNewRecipe

// END OF FILE ------------------------------------------------------------------------------------