import { useState, useEffect } from 'react';
import RecipeDetails from '../components/RecipeDetails';
import Loading from '../components/Loading';
import CreateNewRecipe from '../components/CreateNewRecipe';

// NOTE: SETTING BACKEND URL
const BACKEND = process.env.BACKEND_URL;

// NOTE: RECIPE PAGE LOGIC ------------------------------------------------------------------------
const Recipe = () => {
    // NOTE: STATE VARIABLES
    const [recipes, setRecipes] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);

    // NOTE: ADDING TIME FOR LOADING
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    //NOTE: FETCHING RECIPES FROM SERVER ----------------------------------------------------------
    useEffect(() => {
        const fetchRecipes = async () => {
            console.log(BACKEND)
            const response = await fetch('http://localhost:4000/recipes') // FIXME: REMOVE FULL URL
            const json = await response.json()

            if (response.ok) {
                setRecipes(json)
            }
        }

        fetchRecipes()
    }, [])

    // NOTE: HANDLING TOGGLE ----------------------------------------------------------------------
    const handleClick = () => {
        setToggle(!toggle)
    }

    // NOTE: DISPLAYING RECIPES -------------------------------------------------------------------
    return (
        <div className='content-container'>
            <h1 className='page-title'>RECIPES</h1>
            <p className='page-description'>Find an inspiration for your next big hit!</p>
            <form>
                <input 
                    type="text"
                />
            </form>
            <div className='add-recipe-container'>
            <button onClick={() => handleClick()}>+ Add new recipe</button>
                {toggle && (
                    <div className='new-recipe-form'>
                        <CreateNewRecipe />
                    </div>
                )}
            </div>
            <div className='recipes-container'>
            {isLoading 
                // NOTE: REPEATING DISPLAY INSPIRED BY: https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
                ? Array.from({length: 10 }, (_, i) => <Loading key={i}/>)
                : recipes
                    ? recipes.map((recipe) => ( <RecipeDetails key={recipe._id} recipe={recipe}/>))
                    : <p>Couldn't display recipes.</p>
                
            }
            </div>
        </div>
    )
}

export default Recipe