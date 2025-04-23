// IMPORTS ----------------------------------------------------------------------------------------
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router';
import RecipeDetails from '../components/RecipeDetails';
import Loading from '../components/Loading';
import Select from 'react-select'
import { useAuthContext } from '../hooks/useAuthContext';

// NOTE: SETTING BACKEND URL
// const BACKEND = process.env.BACKEND_URL;

// NOTE: RECIPE PAGE LOGIC ------------------------------------------------------------------------
const Recipe = ({ setShowNavbar, role }) => {

    // NOTE: SETTING NAV BAR TO TRUE
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: STATE VARIABLES
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(null);
    const [filteredRecipes, setFilteredRecipes] = useState(null);
    const [isLoading, setLoading] = useState(true);
    // const [toggle, setToggle] = useState(true);
    const [searchIngred, setSearchIngred] = useState([]);
    const [allCountries, setAllCountries] = useState([]);
    const [pickedIngred, setPickedIngred] = useState([]);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [filterOrigin, setFilterOrigin] = useState('');
    const [filterMealType, setFilterMealType] = useState('');
    const [filterServingSize, setFilterServingSize] = useState(0);
    const [filterTime, setFilterTime] = useState(0);
    const { user } = useAuthContext()

    // NOTE: ADDING TIME FOR LOADING
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    //NOTE: FETCHING RECIPES FROM SERVER ----------------------------------------------------------
    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('http://localhost:4000/recipes')
            const json = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (response.ok) {
                const recipeArray = []
                // CHECKS ALL RECIPES IF THE RECIPES STATUS IS NOT DENIED OR PENDING
                for (var i = 0; i < json.length; i++) {
                    if (json[i].approvalStatus === 'approved' && json[i].variationOfRecipe.status === false) {
                        recipeArray.push(json[i])
                    }
                    // ADDING ALL RECIPES THAT HAS A STATUS PENDING OR APPROVED
                    setFilteredRecipes(recipeArray)
                    setRecipes(recipeArray)
                }

                // NOTE: ADDING ALL RECIPES TO DROPDOWN LIST
                const ingredArray = []
                const originArray = []
                // SETTING MATCH TO FALSE
                var match = false
                // ITERATING THROUGH RETURNED RECIPES
                for (var i = 0; i <= json.length-1; i++) {
                    // ITERATING THROUGH EACH RECIPES INGREDIENTS
                    for (var j = 0; j <= json[i].ingredients.length-1; j++) {
                        // MAKING SURE MATCH IS FALSE FOR EACH ITTERATION
                        match = false
                        // STORING INGREDIENTS NAME IN 'ingredientName'
                        const ingredientName = json[i].ingredients[j].ingredient
                        // SETTING THE DROPDOWN OPTION WITH THE CURRENT INGREDIENT
                        const option = {value: ingredientName.toLowerCase(), label: ingredientName.toLowerCase()}

                        // CHECKING IF INGREDIENT IS ALREADY STORED IN THE 'ingredArray'
                        if (ingredArray.some(ing => ing.value === option.value)) {
                            match = true
                        }
                        // IF IT IS NOT STORED IN THE ARRAY --> ADDS INGREDIENT TO ARRAY
                        if (!match) {
                            ingredArray.push(option)
                        }

                    }

                    // NOTE: LOGIC TO GET ALL COUNTRIES CONTAINED BY THE RECIPES
                    if (originArray.length !== 0 ) {
                        // NOTE: BOOLEAN TO CHECK IF COUNTRY HAS ALREADY BEEN FOUND
                        var containsCountry = false
                        // NOTE: GOING THROUGH ALL COUNTRIES THAT HAS BEEN ADDED TO THE 'originArray'
                        originArray.filter((country) => {
                            // CHECKING IF THE CURRENT ITERATION OF 'origin' IS IN THE "originArray"
                            if (json[i].origin === country) {
                                // IF IT IS CONATINED IN THE ARRAY IT RETURNS THE BOOLEAN VALUE 'true'
                                containsCountry = true
                            }
                        })
                        // NOTE: MAKING SURE THE COUNTRY ISNT CONTAINED IN THE ARRAY
                        if (containsCountry === false) {
                            // THEN ADDING IT TO THE ARRAY
                            originArray.push(json[i].origin)
                        }
                    // IF THE ARRAY IS EMPTY IT ADDS THE FIRST COUNTRY
                    } else {
                        originArray.push(json[i].origin)
                    }
                }
                setAllCountries(originArray)
                setSearchIngred(ingredArray)
            }
        }

        fetchRecipes()
    }, [])

    // NOTE: HANDLING NEW RECIPES -----------------------------------------------------------------
    const reDirect = () => {
        navigate('/newrecipe')
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

    // NOTE: HANDLING THE INPUT CHANGE ------------------------------------------------------------
    const handleInputChange = (e) => {
        e.preventDefault()
        const searchTerm = e.target.value;
        setSearchPrompt(searchTerm)
    }

    // NOTE: FILTERING THE RECIPES BASED ON THE SEARCH PROMPT -------------------------------------
    const FilterSearchPrompt = (e) => {
        e.preventDefault()
        const filteredItems = recipes.filter((recipe) => 
           recipe.title.toLowerCase().includes(searchPrompt.toLowerCase())
        )
        setFilteredRecipes(filteredItems);
    }

    // NOTE: HANDLING FILTERS ---------------------------------------------------------------------
    const handleFilter = (e) => {
        e.preventDefault()
        const filteredIngredients = recipes.filter((recipe) => {          
            // NOTE: ADAPTED FROM: https://www.geeksforgeeks.org/how-to-implement-multiple-filters-in-react/
            return (
                (filterDifficulty === '' ||
                 recipe.difficulty === filterDifficulty) &&
                (filterOrigin === '' ||
                 recipe.origin === filterOrigin) &&
                (filterMealType === '' ||
                 recipe.mealType === filterMealType) &&
                (filterServingSize === 0 ||
                 recipe.servingSize == filterServingSize) &&
                (filterTime === 0 || 
                 (recipe.prepTime + recipe.cookTime) <= filterTime)
            )
        })
        setFilteredRecipes(filteredIngredients)
    }

    // NOTE: HANDLING CLEARING THE FILTERS --------------------------------------------------------
    const handleClear = (e) => {
        setFilteredRecipes(recipes)
        setFilterDifficulty('')
        setFilterOrigin('')
        setFilterMealType('')
        setFilterServingSize(0)
        setFilterTime(0)
    }

    // NOTE: DISPLAYING RECIPES -------------------------------------------------------------------
    return (
        <div className='main-container'>
            <div className='filter-container'>
                <h2>Search Filters</h2>
                <h4>Search for recipes using ingredients</h4>
                <div className='ingredient-search'>
                    <Select 
                        options={searchIngred} 
                        isMulti={true} 
                        isSearchable={true} 
                        isClearable={true}
                        hideSelectedOptions={true}
                        placeholder='Select Ingredients...'
                        onChange={e => setPickedIngred(e)}
                        className='ingred-select'
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 10,
                        })}
                    />         
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className='filters'>
                    <form>
                        <span className='hr'></span>
                        <h4>Select a difficulty</h4>
                        <div className='difficulty-filter-radio'>
                            <input 
                                type='radio'
                                name='difficulty'
                                id='easy'
                                value='easy'
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                            />
                            <span className="radio"></span>
                            <label for='easy'>Easy</label>
                        </div>
                        <div className='difficulty-filter-radio'>
                            <input 
                                type='radio'
                                name='difficulty'
                                id='moderate'
                                value='moderate'
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                            />
                            <span className="radio"></span>
                            <label for='moderate'>Moderate</label>
                        </div>
                        <div className='difficulty-filter-radio'>
                            <input 
                                type='radio'
                                name='difficulty'
                                id='hard'
                                value='hard'
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                            />
                            <span className="radio"></span>
                            <label for='hard'>Hard</label>
                        </div>
                        <span className='hr'></span>
                        <h4>Select a origin country</h4>
                        <select onChange={(e) => setFilterOrigin(e.target.value)}>
                            <option selected hidden>Filter by Origin Country</option>
                            {Array.from({length: allCountries.length}, (_,i) => 
                                <option value={allCountries[i]}>{allCountries[i]}</option>
                            )}
                            {/* USE MAP TO ADD ALL COUNTRIES */}
                        </select>
                        <span className='hr'></span>
                        <h4>Select a type of meal</h4>
                        <select onChange={(e) => setFilterMealType(e.target.value)}>
                            <option selected hidden>Filter by meal type</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="brunch">Brunch</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="dish">Dish</option>
                            <option value="snack">Snack</option>
                            <option value="drink">Drink</option>
                            <option value="dessert">Dessert</option>
                            <option value="other">Other</option>
                            {/* USE MAP TO ADD ALL COUNTRIES */}
                        </select>
                        <span className='hr'></span>
                        <h4>Enter serving size</h4>
                        <input 
                            type='Number'
                            min="0"
                            placeholder='Enter number of people...'
                            onChange={(e) => setFilterServingSize(e.target.value)}
                        />
                        <span className='hr'></span>
                        <h4>Enter maximum recipe time</h4>
                        <input
                            type='Number' 
                            min="0"
                            placeholder='Enter number of minutes...'
                            onChange={(e) => setFilterTime(e.target.value)}
                        />
                        <input type="reset" onClick={handleClear}></input>
                        <button className='filter-btn' onClick={handleFilter}>Filter</button>
                    </form>
                </div>
            </div>
            <div className='content-container'>
                <h1 className='page-title'>BROWSE RECIPES</h1>
                <form onSubmit={FilterSearchPrompt}>
                    <div className='search-options'>
                        <input 
                            type="text"
                            className='search-field'
                            value={searchPrompt}
                            onChange={handleInputChange}
                            placeholder='Search for a recipe title...'
                        />
                    </div>
                </form>
                {user && (
                    <div className='add-recipe-container'>
                        <button onClick={reDirect}>+ Add new recipe</button>
                    </div>
                )}
                <div className='recipes-container'>
                {isLoading 
                    // ADAPTED FROM: REPEATING DISPLAY INSPIRED BY: https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
                    ? Array.from({length: 10 }, (_, i) => <Loading key={i}/>)
                    : filteredRecipes
                        ? filteredRecipes.map((recipe) => ( <RecipeDetails key={recipe._id} recipe={recipe} role={role}/>))
                        : <p>Couldn't display recipes.</p>
                    
                }
                </div>
            </div>
        </div>
    )
}

export default Recipe

// END OF DOCUMENT --------------------------------------------------------------------------------