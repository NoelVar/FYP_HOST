import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

// NOTE: RECIPE DETAILS ---------------------------------------------------------------------------
const RecipeDetails = ({ recipe, role}) => {

    // NOTE: URL 
    const urlName = recipe._id

    // VARIABLE TO STORE LOGGED IN USER
    const { user } = useAuthContext()

    // NOTE: HANDLING DELETE ----------------------------------------------------------------------
    const handleDelete = async () => {
        if (user) {
            const response = await fetch(`http://localhost:4000/recipes/` + recipe._id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Deleted: " + recipe._id)
            }
        }
    } 

    // NOTE: RETURNING INDIVIDUAL RECIPE DETAILS --------------------------------------------------
    return (
        <div className="recipe-details">
            <Link to={urlName.toLowerCase()}>
                {recipe.image
                    ? <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
                    : <img src='ED2_LOGOV5.png' />
                }
                <div className="recipe-info">
                    <h2>{recipe.title}</h2>
                    <p><i className="fa-regular fa-clock"></i> {recipe.prepTime + recipe.cookTime} minutes</p>
                    <p><i className="fa-solid fa-bowl-food"></i> {recipe.servingSize} servings</p>
                    <p><i className="fa-solid fa-kitchen-set"></i> {recipe.difficulty}</p>
                </div>
                {role && (role === 'admin' || role === 'moderator') &&
                    <button className="delete-recipe-btn" onClick={handleDelete}>X</button>
                }
            </Link>
        </div>
    )
}

export default RecipeDetails

// END OF DOCUMENT --------------------------------------------------------------------------------