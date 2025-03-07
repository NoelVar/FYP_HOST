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
    const [content, setContent] = useState('');
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
        // console.log(recipe.comments)
        
        // TODO: CHANGE TO REFERENCED DATA MODEL
        await axios.post(`${urlname}/comments`, {
            name: UserName,
            content: content,
            timestamp: currentDate
        })
        .then((response) => {
            if(response.ok) {
                console.log(response.data.message)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }


    return (
        <div className="recipe-discussion-box">
            {recipe
                ? 
                <div>
                    <RecipeCommunitySwitch key={recipe._id} recipe={recipe} active={'discussion'}/>
                    <div className="discussion-page">
                        <h1>{recipe.title} discussion board</h1>
                        <span className='hr'></span>
                        <h2>Leave a comment!</h2>
                        <form>
                            <textarea
                                placeholder="Share your thoughts..."
                                onChange={e => setContent(e.target.value)}
                            />
                            <button onClick={handleSubmit}>Post</button>
                        </form>
                        <div className="discussion-box">
                            {recipe.comments.map((comment) => (
                                <div className="discussion-card">
                                    <div className="comment-header">
                                    <h3>{comment.name}</h3> 
                                    <i>{new Date(comment.timestamp).toDateString()}</i>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                : <p>No discussion found!</p>
            }
        </div>
    )
}

export default Discussions