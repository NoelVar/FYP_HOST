import { useState, useEffect, useLayoutEffect } from "react";
import RecipeCommunitySwitch from "../components/RecipeCommunitySwitch";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useRecipeContext } from "../hooks/useRecipeContext";

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
    const { user } = useAuthContext()
    const { comments, dispatch } = useRecipeContext()
    const params = window.location.href
    const urlname = 'http://localhost:4000/recipes/' + params.split('/').reverse()[1]
    const [commentUsers, setCommentUsers] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        // NOTE: FETCHING THE RECIPE FROM THE SERVER
        const fetchRecipe = async () => {
            try {
                const response = await fetch(urlname)
                const json = await response.json()

                if (response.ok) {
                    setRecipe(json)
                    dispatch({ type: "SET_COMMENTS", payload: json.comments })
                }
            } catch (err) {
                console.log(err)
            }
        }

        const fetchLoggedInUser = async () => {
            const email = user.email
            try {
                const response = await fetch('http://localhost:4000/user/single-user', {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({email})
                })
                const json = await response.json()

                if (response.ok) {
                    setLoggedInUser(json)
                    console.log(json)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchRecipe()
        if (user) {
            fetchLoggedInUser()
        }
    }, [])

    // NOTE: SENDING THE RECIPE TO THE SERVER
    const handleSubmit = async(e) => {
        e.preventDefault()
        if (user) {

            const email = user.email
            const currentDate = Date.now()
        
            // TODO: CHANGE TO REFERENCED DATA MODEL
            const response = await fetch(`${urlname}/comments`, {
                method: "POST", 
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json' 
                },
                body: JSON.stringify({
                    email: email,
                    content: content,
                    timestamp: currentDate
                })
            })
            
            const json = await response.json()

            if(!response.ok) {
                setError(json.error)
                setTimeout(() => {
                    setError(null)
                }, 3000)
            }

            if(response.ok) {
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                }, 3000)
                dispatch({ type: "ADD_COMMENT", payload: json.comment })
                // Fetch the username for the new comment
                if (json.comment.user) {
                    fetchUsernames(json.comment.user._id)
                }
                setContent('')
            }
        } else {
            // TODO: ADD MESSAGE AND REDIRECT AFTER 2 Seconds
            setError('You need to login to use this functionality!')
            setTimeout(() => navigate('/login'), 3000)
        }
    }

    // NOTE: SENDING THE RECIPE TO THE SERVER
    const handleDelete = async(e, comment) => {
        e.preventDefault()
        if (user){
            const email = user.email
           
        try {
            const response = await fetch(`${urlname}/comments`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json' ,
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({email: email, commentID: comment})
            })

            const json = await response.json()

            if (!response.ok) {
                setError(json.error)
                setTimeout(() => {
                    setError(null)
                }, 3000)
            }

            if (response.ok) {
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                }, 3000)
                dispatch({ type: "DELETE_COMMENT", payload: json.comment })         
            }

        } catch (err) {
            console.log(err)
        }
        } else {
            // TODO: ADD MESSAGE AND REDIRECT AFTER 2 Seconds
            setError('You need to login to use this functionality!')
            setTimeout(() => navigate('/login'), 3000)
        }
    }

    // HANDLE DELETING USER'S COMMENT AS ADMIN OR MOD ---------------------------------------------
    const removeUserComment = async(e, comment) => {
        e.preventDefault()
        if (user){
            const email = user.email
           
        try {
            const response = await fetch(`${urlname}/comments/moderate`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json' ,
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({email: email, commentID: comment})
            })

            const json = await response.json()

            if (!response.ok) {
                setError(json.error)
                setTimeout(() => {
                    setError(null)
                }, 3000)
            }

            if (response.ok) {
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                }, 3000)
                dispatch({ type: "DELETE_COMMENT", payload: json.comment })         
            }

        } catch (err) {
            console.log(err)
        }
        } else {
            // TODO: ADD MESSAGE AND REDIRECT AFTER 2 Seconds
            setError('You need to login to use this functionality!')
            setTimeout(() => navigate('/login'), 3000)
        }
    }

    // NOTE: FUNCTION TO RETRIEVE USERNAMES -------------------------------------------------------
    const fetchUsernames = async (userId) => {
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
        if (recipe && comments) {
            comments.forEach(comment => {
                if (comment.user && !commentUsers[comment.user]) {
                    fetchUsernames(comment.user);
                }
            });
        }
    }, [recipe, comments]);

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
                                    value={content}
                                />
                                <button type="submit">Post</button>
                            </form>
                        {/* {message && <div className="error-message">{message}</div>} */}
                        <div className="discussion-box">
                            {comments
                                ? 
                                comments.map((comment) => (  
                                    <div className="discussion-card" key={comment._id}>                                                             
                                        <div className="comment-header">
                                            {/* DISPLAYING USERNAMES OR 'Anonymous' IF THEY HAVE NOT LOADED COMPLETELY */}
                                            <h3>{commentUsers[comment.user] || comment.user.username || 'Anonymous Cook'}</h3> 
                                            <i>{new Date(comment.timestamp).toDateString()}</i>
                                        </div>
                                        <p>{comment.content}</p>
                                        {loggedInUser && comment.user && loggedInUser.role === 'user' && loggedInUser._id.toString() === comment.user.toString() &&
                                            <button onClick={(e) => handleDelete(e, comment._id)} className="comment-delete">Delete</button>
                                        }
                                        {loggedInUser && (loggedInUser.role === 'moderator' || loggedInUser.role === 'admin') &&
                                            <button onClick={(e) => removeUserComment(e, comment._id)} className="comment-delete">Delete</button>
                                        }
                                    </div>
                                ))
                                :
                                <p className="own-recipe-container">No comments on this recipe yet!</p>
                            }
                        </div>
                    </div>
                </div>
                : <p>No discussion found!</p>
            }
            {error &&
                <div className="alert-error">
                    <p>{error}</p>
                </div>
            }
            {message &&
                <div className="alert-message">
                    <p>{message}</p>
                </div>  
            }
            <Footer />
        </div>
    )
}

export default Discussions