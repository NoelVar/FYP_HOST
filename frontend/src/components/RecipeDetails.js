const RecipeDetails = ({ recipe }) => {
    return (
        <div className="recipe-details">
            <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
            <h2>{recipe.title}</h2>
            <p><i className="fa-regular fa-clock"></i> {recipe.prepTime + recipe.cookTime} minutes</p>
            <p><i class="fa-solid fa-bowl-food"></i> {recipe.servingSize} servings</p>
            <p><i class="fa-solid fa-kitchen-set"></i> {recipe.difficulty}</p>
        </div>
    )
}

export default RecipeDetails