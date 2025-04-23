// IMPORTS ----------------------------------------------------------------------------------------
import { Link } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import RecipeDetails from "../components/RecipeDetails";
import Footer from "../components/Footer";

// HOME PAGE --------------------------------------------------------------------------------------
const Home = ({ setShowNavbar }) => {

    // NOTE: VARIABLES
    const [popularRecipe, SetPopularRecipe] = useState(null)

    // NOTE: SETTING NAV BAR TO TRUE
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    //NOTE: FETCHING POPULAR RECIPE FROM SERVER ---------------------------------------------------
        useEffect(() => {
            const fetchPopular = async () => {
                const response = await fetch('http://localhost:4000/recipes/recipe/popular')
                const json = await response.json()
    
                // CHECKING IF RESPONSE IS OKAY
                if (response.ok) {
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
            <div id="about-container">
                <h2>What is EdibleEducation?</h2>
                <p>
                    EdibleEducation is a community driven platform that provides an opportunity for it's users
                    to share their own recipes, create variations of others' recipes, and star discussions
                    related to recipes. These all aim to bring people closer to food, since it's a way of 
                    expressing culture, family tradition, and individuality, while also making an impact on the world
                    around us. <br></br>
                    <b>Note for your journey: </b>Every recipe that contain the EdibleEducation logo 
                    indicates that these recipes have variations, find them and EXPLORE them!
                </p>
                <img src='../ED2_LOGOV6.png' alt='Has variations'></img>
            </div>
            { popularRecipe &&
            <div className="recipe-of-the-week">
                <h2>Highlighted recipes</h2>
                <div className="suggestions">
                    <div className="suggestion">
                            <table className="highlights">
                                <tr className="highlight-headers">
                                    <th>Most rated</th>
                                    <th>Best rated</th>
                                    <th>Most comments</th>
                                    <th>Latest</th>
                                </tr>
                                <tr className='highlight-recipes'>
                                {popularRecipe.map((recipe) => (
                                    <td>
                                    <RecipeDetails key={recipe._id} recipe={recipe}/>
                                    </td>
                                )
                                )}
                                </tr>
                            </table>
                    </div>
                </div>
            </div>
            }
            <Footer />
        </div>
    )
}

export default Home

// END OF DOCUMENT --------------------------------------------------------------------------------