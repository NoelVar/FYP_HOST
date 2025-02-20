const RecipeDetails = ({ recipe }) => {
    return (
        <div className="recipe-details">
            <h2>{recipe.title}</h2>
            <p>{recipe.prepTime + recipe.cookTime} minutes</p>
            <p>Serves {recipe.servingSize}</p>
            <p>{recipe.difficulty}</p>
        </div>
    )
}

export default RecipeDetails