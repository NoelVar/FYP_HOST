import { useState, useEffect, useLayoutEffect } from "react";
import RecipeCommunitySwitch from "../components/RecipeCommunitySwitch";
import axios from "axios";

const Discussions = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

     // NOTE: STATE VARIABLES
    const [recipe, setRecipe] = useState(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [time, setTime] = useState(Date)
    const params = window.location.href
    const urlname = 'http://localhost:4000/recipes/' + params.split('/').reverse()[1]
    
    useEffect(() => {
        // NOTE: FETCHING THE RECIPE FROM THE SERVER
        const fetchRecipe = async () => {
            try {
                const response = await fetch(urlname)
                const json = await response.json()

                if (response.ok) {
                    setRecipe(json)
                    console.log(json)
                }
            } catch (err) {
                console.log(err)
            }
            
        }
        
        fetchRecipe()
    }, [])

    // NOTE: SENDING THE RECIPE TO THE SERVER
    const handleSubmit = async(e) => {
        e.preventDefault()

        const UserName = 'userName'
        const currentDate = Date.now()
        console.log(recipe.comments)
        recipe.comments.push(
            {
                name: UserName,
                content: content,
                timeStamp: currentDate
            }
        )

        await axios.put(urlname, {
            title: recipe.title,
            image: recipe.image,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servingSize: recipe.servingSize,
            difficulty: recipe.difficulty,
            origin: recipe.origin,
            mealType: recipe.mealType,
            prepInstructions: recipe.prepInstructions,
            cookIntructions: recipe.cookIntructions,
            ingredients: recipe.ingredients,
            nutritionalInfo: recipe.nutritionalInfo,
            comments: recipe.comments,
            approvalStatus: recipe.approvalStatus
        })
        .then((response) => {
            if(response.ok) {
                console.log(response.data.message)
            }
        })
        .catch((err) => {
            console.log(err)
        })
        
        console.log(recipe.comments)
        console.log(UserName + ' Posted: ' + content + ", at " + Date(currentDate))
    }

    return (
        <div>
            {recipe
                ? 
                <div>
                    <RecipeCommunitySwitch key={recipe._id} recipe={recipe} active={'discussion'}/>
                    <div className="information">
                        <h1>{recipe.title} Discussion</h1>
                        <div className="discussion-box">
                            {recipe.comments.map((comment) => (
                                <div className="discussion-card">
                                    <h3>{comment.name}</h3>
                                    <p>{comment.content}</p>
                                    <p>{comment.timeStamp}</p>
                                </div>
                            ))}
                        </div>
                        <form>
                            <input
                                type="text"
                                placeholder="comment"
                                onChange={e => setContent(e.target.value)}
                            />
                            <button onClick={handleSubmit}>Post</button>
                        </form>
                    </div>
                </div>
                : <p>No discussion found!</p>
            }
        </div>
    )
}

export default Discussions