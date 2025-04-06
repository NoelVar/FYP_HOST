import { useState, useEffect, useLayoutEffect } from "react";
import RecipeCommunitySwitch from "../components/RecipeCommunitySwitch";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Discussions = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

     // NOTE: STATE VARIABLES
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null);
    const [content, setContent] = useState('');
    const [message, setMessage] = useState(null);
    const [commenter, setCommenter] = useState(null)
    const { user } = useAuthContext()
    const params = window.location.href
    const urlname = 'http://localhost:4000/recipes/' + params.split('/').reverse()[1]
    const [commentUsers, setCommentUsers] = useState({});
    
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
        if (user) {

            const email = user.email
            const currentDate = Date.now()
            // DEBUG: console.log(recipe.comments)
        
            // TODO: CHANGE TO REFERENCED DATA MODEL
            await axios.post(`${urlname}/comments`, {
                email: email,
                content: content,
                timestamp: currentDate
            }, { 
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } 
            })
            .then((response) => {
                if(response.ok) {
                    console.log(response.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            // TODO: ADD MESSAGE AND REDIRECT AFTER 2 Seconds
            setMessage('You need to login to use this functionality!')
            setTimeout(() => navigate('/login'), 3000)
        }
    }


    // NOTE: FUNCTION TO RETRIEVE USERNAMES -------------------------------------------------------
    const fetchUser = async (userId) => {
        try {
            const response = await fetch('http://localhost:4000/user/single-user-id', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ id: userId })
            });
            const json = await response.json();

            if (response.ok) {
                // ADDS USERNAME TO 'commentUsers' STATE OBJECT
                setCommentUsers(prev => ({
                    ...prev,
                    [userId]: json
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // USER EFFECT TO FETCH USERNAMES WHEN COMMENTS LOAD
    useEffect(() => {
        if (recipe && recipe.comments) {
            recipe.comments.forEach(comment => {
                if (comment.user && !commentUsers[comment.user]) {
                    fetchUser(comment.user);
                }
            });
        }
    }, [recipe]);

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
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    required
                                    placeholder="Share your thoughts..."
                                    onChange={e => setContent(e.target.value)}
                                />
                                <button type="submit">Post</button>
                            </form>
                        {message && <div className="error-message">{message}</div>}
                        <div className="discussion-box">
                            {recipe.comments.map((comment) => (  
                                <div className="discussion-card" key={comment._id}>                                                             
                                    <div className="comment-header">
                                        {/* DISPLAYING USERNAMES OR 'Anonymous' IF THEY HAVE NOT LOADED COMPLETELY */}
                                        <h3>{commentUsers[comment.user] || 'Anonymous Cook'}</h3> 
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
            <Footer />
        </div>
    )
}

export default Discussions