import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router';
import RecipeDetails from '../components/RecipeDetails';
import Loading from '../components/Loading';
import Select from 'react-select'

// NOTE: SETTING BACKEND URL
const BACKEND = process.env.BACKEND_URL;

// NOTE: RECIPE PAGE LOGIC ------------------------------------------------------------------------
const Recipe = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: STATE VARIABLES
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    const [searchIngred, setSearchIngred] = useState([])
    const [pickedIngred, setPickedIngred] = useState([])

    // NOTE: ADDING TIME FOR LOADING
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    //NOTE: FETCHING RECIPES FROM SERVER ----------------------------------------------------------
    useEffect(() => {
        const fetchRecipes = async () => {
            // console.log(BACKEND)
            const response = await fetch('http://localhost:4000/recipes') // FIXME: REMOVE FULL URL
            const json = await response.json()

            if (response.ok) {
                setRecipes(json)
                setFilteredRecipes(json)

                const array = []
                for (var i = 0; i <= json.length-1; i++) {
                    for (var j = 0; j <= json[i].ingredients.length-1; j++) {
                        const ingredientName = json[i].ingredients[j].ingredient
                        // console.log(ingredientName)
                        const option = {value: ingredientName.toLowerCase(), label: ingredientName}
                        array.push(option)
                    }
                }
                // console.log(array)
                setSearchIngred(array)
            }
        }

        fetchRecipes()
    }, [])

    // NOTE: HANDLING NEW RECIPES -----------------------------------------------------------------
    const reDirect = () => {
        navigate('/newrecipe')
    }

    // NOTE: HANDLING FILTER TOGGLE ---------------------------------------------------------------
    const handleToggle = (e) => {
        e.preventDefault()
        setToggle(!toggle)
    }
    // NOTE: HANDLING SEARCH ----------------------------------------------------------------------
    const handleSearch = (e) => {
        e.preventDefault()
        // NOTE: CHECKS IF AN INGREDIENT HAS BEEN ENETERED
        if (pickedIngred.length > 0) {
            // NOTE: CREATES AN EMPTY ARRAY TO STORE ALL RETURNED RECIEPS
            const filteredRecipes = []
            // NOTE: WILL CHECK EVERY ENTERED INGREDIENT
            for (var j = 0; j <= pickedIngred.length-1; j++) {
                // NOTE: FILTERING THE RECIPES AND STORING THEM IN 'filteredIngredients'
                const filteredIngredients = recipes.filter(
                    (recipe) => {
                        // NOTE: GOING THROUGH EACH INGREDIENT IN EVERY RECIPE
                        for (var i = 0; i <= recipe.ingredients.length-1; i++) {
                            // NOTE: CHECKS IF THE RECIPE INGREDIENT CONTAINS THE SEARCH PROMPT IF SO RETURNS IT
                            if (recipe.ingredients[i].ingredient.toLowerCase().includes(pickedIngred[j].value) === true) {
                                return recipe.ingredients[i].ingredient.toLowerCase().includes(pickedIngred[j].value);
                            }
                        } 
                    }
                )
                // NOTE: STORES THE RETURNED RECIPES IN THE 'filteredRecipes' array
                for (var i = 0; i <= filteredIngredients.length-1; i++) {
                    // NOTE: MAKES SURE THE FILTERED RECIPES DOESNT ALREADY CONTAIN THE OBJECT
                    if (filteredRecipes.indexOf(filteredIngredients[i]) === -1) {
                        filteredRecipes.push(filteredIngredients[i])
                    }
                }
            }
            // NOTE: SETS THE FILTERED RECIPES TO EVERY RETURNED RECIPE
            setFilteredRecipes(filteredRecipes)
        } else {
            // NOTE: IF THERE IS NO SEARCH PROMPT IT RETURNS EVERY RECIPE
            setFilteredRecipes(recipes)
        }
    }

    // NOTE: DISPLAYING RECIPES -------------------------------------------------------------------
    return (
        <div className='content-container'>
            <h1 className='page-title'>RECIPES</h1>
            <p className='page-description'>Find an inspiration for your next big hit!</p>
            <form>
                <div className='search-options'>
                    <input 
                        type="text"
                        className='search-field'
                        placeholder='Search for a recipe title...'
                    />
                    <button className='search-filter' onClick={handleToggle}><i className='fa fa-bars menu-toggle'></i></button>
                </div>
                {/* https://react-select.com/home */}
                {toggle
                    ? <div className='ingredient-search'>
                            <Select 
                                options={searchIngred} 
                                isMulti={true} 
                                isSearchable={true} 
                                isClearable={true}
                                hideSelectedOptions={true}
                                placeholder='Select Ingredients...'
                                onChange={e => setPickedIngred(e)}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 10,
                                })}
                            />         
                             <button onClick={handleSearch}>Search</button>
                      </div>
                    : <p>&nbsp;</p>
                }
            </form>
            <div className='add-recipe-container'>
                <button onClick={reDirect}>+ Add new recipe</button>
            </div>
            <div className='recipes-container'>
            {isLoading 
                // RESEARCH / REFERENCE: REPEATING DISPLAY INSPIRED BY: https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
                ? Array.from({length: 10 }, (_, i) => <Loading key={i}/>)
                : filteredRecipes
                    ? filteredRecipes.map((recipe) => ( <RecipeDetails key={recipe._id} recipe={recipe}/>))
                    : <p>Couldn't display recipes.</p>
                
            }
            </div>
        </div>
    )
}

export default Recipe

// END OF DOCUMENT --------------------------------------------------------------------------------