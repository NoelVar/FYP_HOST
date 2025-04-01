import { Link } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import RecipeDetails from "../components/RecipeDetails";

const Home = ({ setShowNavbar }) => {

    // NOTE: VARIABLES
    const [popularRecipe, SetPopularRecipe] = useState(null)

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    //NOTE: FETCHING POPULAR RECIPE FROM SERVER ---------------------------------------------------
        useEffect(() => {
            const fetchPopular = async () => {
                // console.log(BACKEND)
                const response = await fetch('http://localhost:4000/recipes/recipe/popular') // FIXME: REMOVE FULL URL
                const json = await response.json()
    
                // CHECKING IF RESPONSE IS OKAY
                if (response.ok) {
                    console.log(json)
                    SetPopularRecipe(json)
                }
            }

            fetchPopular()
        }, [])

    return (
        <div className="home-page">
            <div className="eye-catcher">
                <div className="main-text">
                    <h1 className="main-title">EdibleEducation</h1>
                    <p>Connect and share your knowledge with others throught recipes!<br/> 
                        Explore cultural differences, new recipes and better your skills with EdibleEducation!
                    </p>
                    <Link to='/recipes'>Recipes</Link>
                </div>
                <div className="main-img">
                    <img src='eye-catcher-dish.png' alt='Home made Lobster with Stake' />
                </div>
            </div>
            { popularRecipe &&
            <div className="recipe-of-the-week">
                <h2>Highlighted recipes</h2>
                <div className="suggestions">
                    <div className="suggestion">
                            {popularRecipe.map((recipe) => (
                                <RecipeDetails key={recipe._id} recipe={recipe}/>
                            )
                            )}
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Home

// END OF DOCUMENT --------------------------------------------------------------------------------