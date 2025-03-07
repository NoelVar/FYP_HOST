// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLayoutEffect } from "react";

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

    // NOTE: FUNCTION TO HANDLE THE SUBMITION ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const approvalStatus = 'pending';

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

        // NOTE: SENDING THE RECIPE TO THE SERVER
        const response = await fetch('http://localhost:4000/recipes', {
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

    // NOTE: DISPLAYING FORM ----------------------------------------------------------------------
    return (
        <div className="add-recipe-box">
            <form onSubmit={handleSubmit} className="add-recipe-form">
                <h1>Share your recipe with others!</h1>
                <p>By submitting a recipe you agree to the <Link>Terms and conditions</Link></p>
                {/*NOTE: TITLE*/}
                <div className="single-input">
                    <label>Title: <span className="required">*</span> </label>
                    <input 
                        type="text"
                        value={title}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                {/*NOTE: IMAGE*/}
                {/* ADAPTED FROM: https://dev.to/yosraskhiri/how-to-upload-an-image-using-mern-stack-1j95*/}
                <div className="single-input">
                    <label>Image: </label>
                    <label for="file" className="file-input">Browse and select your file +</label>
                    <input 
                        type="file"
                        id="file"
                        accept=".png, .jpg, .jpeg"
                        name="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                {/*NOTE: PREPARATION TIME*/}
                <div className="single-input">
                    <label>Preparation Time: <span className="required">*</span> </label>
                    <input 
                        type="number"
                        value={prepTime}
                        placeholder="Prep"
                        onChange={(e) => setPrepTime(e.target.value)}
                        required
                    />
                </div>
                {/*NOTE: COOK TIME*/}
                <div className="single-input">
                    <label>Cook Time: <span className="required">*</span> </label>
                    <input 
                        type="number"
                        value={cookTime}
                        placeholder="cook"
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
                        placeholder="size"
                        onChange={(e) => setServingSize(e.target.value)}
                        required
                    />
                </div>
                {/*NOTE: DIFFICULTY*/}
                {/* ADAPTED FROM: https://legacy.reactjs.org/docs/forms.html#the-select-tag */}
                <div className="single-input">
                    <label>Difficulty: <span className="required">*</span></label>
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
                        placeholder="Origin"
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
                {/*NOTE: PREPARATION INSTRUCTIONS*/}
                <div className="single-input">
                    <label>Preparation Instructions: <span className="required">*</span></label>
                    <textarea                         
                        value={prepStep}
                        placeholder="prep"
                        onChange={(e) => setPrepStep(e.target.value)}
                        required
                    />
                    <button onClick={handlePrepInst}>Add step</button>
                </div>
                <div className="display-added">
                    {Array.from({length: prepInst.length }, (_, i) => <p>{prepInst[i]}</p> )}
                </div>
                {/*NOTE: COOKING INSTRUCTIONS*/}
                <div className="single-input">
                    <label>Cooking Instructions: <span className="required">*</span></label>
                    <textarea
                        value={cookingStep}
                        placeholder="cook"
                        onChange={(e) => setCookingStep(e.target.value)}
                        required
                    />
                    <button onClick={handleCookInst}>Add step</button>
                </div>
                <div className="display-added">
                    {Array.from({length: cookInst.length }, (_, i) => <p>{cookInst[i]}</p> )}
                </div>
                {/*NOTE: INGREDIENTS*/}
                {/* ADAPTED FROM: https://stackoverflow.com/questions/71880151/updating-an-array-with-usestate-in-a-form */}
                <div className="add-ingredient">
                    <label>Ingredients: <span className="required">*</span></label>
                    <input 
                        type="text" 
                        id="inputItem"
                        name="ingredient"
                        placeholder="Enter a Ingredinet"
                        onChange={handleNewIngredient}
                        required
                    />
                    <label>Quantity: </label>
                    <input 
                        type="number" 
                        id="inputItem"
                        name="quantity"
                        placeholder="Enter the quantity"
                        onChange={handleNewIngredient}
                    />
                    <label>Measurement: </label>
                    <input 
                        type="text"
                        id="inputItem"
                        name="measurement"
                        placeholder="Enter the measurement"
                        onChange={handleNewIngredient}
                    />
                    <button onClick={addIngredient}>Add Ingredient</button>
                </div>
                <div className="display-added">
                    {ingredients.map((ing) => (<span className="added-ing">{ing.ingredient}</span>))}
                </div>
                {/*NOTE: NUTRITIONAL INFO*/}
                <div className="add-ingredient">
                    <label>Total Kcal: </label>
                    <input 
                        type="text" 
                        name="totalKcal"
                        placeholder="nut"
                        onChange={handleNutrition}
                    />
                    <label>Total Carbs: </label>
                    <input 
                        type="text" 
                        name="totalCarbs"
                        placeholder="nut"
                        onChange={handleNutrition}
                    />
                    <label>Total Fat: </label>
                    <input 
                        type="text" 
                        name="totalFat"
                        placeholder="nut"
                        onChange={handleNutrition}
                    />
                    <label>Total Protein: </label>
                    <input 
                        type="text" 
                        name="totalProtein"
                        placeholder="nut"
                        onChange={handleNutrition}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateNewRecipe

// END OF FILE ------------------------------------------------------------------------------------