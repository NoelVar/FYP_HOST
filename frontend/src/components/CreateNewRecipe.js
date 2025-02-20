// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useState } from "react";

// NOTE: CREATE NEW RECIPE ------------------------------------------------------------------------
const CreateNewRecipe = () => {

    // NOTE: USE STATES -------------------------------------------------------------------------------
    const [title, setTitle] = useState('');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [serving, setServingSize] = useState(0);
    const [difficulty, setDificulty] = useState('');
    const [origin, setOrigin] = useState('');
    const [mealType, setMealType] = useState('');
    const [prepInst, setPrepInst] = useState('');
    const [cookInst, setCookInst] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [nutrInfo, setNutrInfo] = useState('');

     // NOTE: FUNCTION TO HANDLE THE SUBMITION --------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // NOTE: CREATING THE RECIPE OBJECT WITH THE USER INPUT
        const recipe = {title, prepTime, cookTime, serving, difficulty, origin, mealType, prepInst, cookInst, ingredient, nutrInfo}
        
        // NOTE: SENDING THE RECIPE TO THE SERVER
        const response = await fetch('/recipes', {
            method: 'POST',
            body: JSON.stringify(recipe),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (response.ok) {
            setTitle('')
            setPrepTime(0)
            setCookTime(0)
            setServingSize(0)
            setDificulty('')
            setOrigin('')
            setMealType('')
            setPrepInst('')
            setCookInst('')
            setIngredient([])
            setNutrInfo('')
            console.log('New recipe added', json)
        }
    }
    
    // NOTE: HANDLING OPTION CHANGE ---------------------------------------------------------------
    const handleDifficultyChange = (e) => {
        setDificulty(e.target.value)
    }

    const handleMealChange = (e) => {
        setMealType(e.target.value)
    }

    // NOTE: ADDING SINGLE INGREDIENT TO LIST OF INGREDIENTS --------------------------------------
    const addIngredient = (e) => {
        e.preventDefault()
        setIngredients([ingredient, ...ingredients])
    }

    // DEBUG: FOR TESTING -------------------------------------------------------------------------
    const testSubmit = (e) => {
        e.preventDefault()

        console.log(title)
        console.log(prepTime)
        console.log(cookTime)
        console.log(serving)
        console.log(difficulty)
        console.log(origin)
        console.log(mealType)
        console.log(prepInst)
        console.log(cookInst)
        console.log(ingredients)
        console.log(nutrInfo)
    }

    // NOTE: DISPLAYING FORM ----------------------------------------------------------------------
    return (
        <form onSubmit={testSubmit} className="add-recipe-form">
            {/*NOTE: TITLE*/}
            <div className="single-input">
                <label>Title: </label>
                <input 
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            {/*NOTE: PREPARATION TIME*/}
            <div className="single-input">
                <label>Preparation Time: </label>
                <input 
                    type="number"
                    value={prepTime}
                    placeholder="Prep"
                    onChange={(e) => setPrepTime(e.target.value)}
                />
            </div>
            {/*NOTE: COOK TIME*/}
            <div className="single-input">
                <label>Cook Time: </label>
                <input 
                    type="number"
                    value={cookTime}
                    placeholder="cook"
                    onChange={(e) => setCookTime(e.target.value)}
                />
            </div>
            {/*NOTE: SERVING SIZE*/}
            <div className="single-input">
                <label>Serving Size: </label>
                <input 
                    type="number"
                    value={serving}
                    placeholder="size"
                    onChange={(e) => setServingSize(e.target.value)}
                />
            </div>
            {/*NOTE: DIFFICULTY*/}
            {/* https://legacy.reactjs.org/docs/forms.html#the-select-tag */}
            <div className="single-input">
                <label>Difficulty: </label>
                <select onChange={(e) => handleDifficultyChange(e)}>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            {/*NOTE: ORIGIN OF DISH*/}
            <div className="single-input">
                <label>Dish Origin: </label>
                <input 
                    type="text"
                    value={origin}
                    placeholder="Origin"
                    onChange={(e) => setOrigin(e.target.value)}
                />
            </div>
            {/*NOTE: MEAL TYPE*/}
            <div className="single-input">
                <label>Meal Type: </label>
                <select onChange={(e) => handleMealChange(e)}>
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
                <label>Preparation Instructions: </label>
                <input 
                    type="text"
                    value={prepInst}
                    placeholder="prep"
                    onChange={(e) => setPrepInst(e.target.value)}
                />
            </div>
            {/*NOTE: COOKING INSTRUCTIONS*/}
            <div className="single-input">
                <label>Cooking Instructions: </label>
                <input 
                    type="text"
                    value={cookInst}
                    placeholder="cook"
                    onChange={(e) => setCookInst(e.target.value)}
                />
            </div>
            {/*NOTE: INGREDIENTS*/}
            {/* https://stackoverflow.com/questions/71880151/updating-an-array-with-usestate-in-a-form */}
            <div className="add-ingredient">
                <label>Ingredients: </label>
                <input 
                    type="text" 
                    id="inputItem" 
                    placeholder="Enter a Ingredinet"
                    onChange={(e) => setIngredient(e.target.value)}
                />
                <button onClick={addIngredient}>Add Ingredient</button>
            </div>
            {ingredients.map((ing) => (ing + " "))}
            {/*NOTE: NUTRITIONAL INFO*/}
            <div className="single-input">
                <label>nutritionalInfo: </label>
                <input 
                    type="text" 
                    value={nutrInfo}
                    placeholder="nut"
                    onChange={(e) => setNutrInfo(e.target.value)}
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    )
}

export default CreateNewRecipe