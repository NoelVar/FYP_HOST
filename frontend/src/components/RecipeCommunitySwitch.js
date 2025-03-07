import { Link } from "react-router-dom"

const RecipeCommunitySwitch = ({ recipe, active }) => {

    const recipeID = recipe._id
    const recipeURL = '/recipes/' + recipeID
    const discussionURL = '/recipes/' + recipeID + '/discussion'

    return (
        <div>
            {active === 'recipe'
                ? 
                <div className="switch-menu">
                    <Link to={recipeURL} className="active">Recipe</Link>
                    <Link to={discussionURL}>{recipe.title} discussion</Link>
                </div>
                : 
                <div className="switch-menu">
                    <Link to={recipeURL}>Recipe</Link>
                    <Link to={discussionURL} className="active">{recipe.title} discussion</Link>
                </div>
            }
        </div>
        
    )
}

export default RecipeCommunitySwitch