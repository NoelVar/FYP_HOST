import { Link, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Footer from "../components/Footer";
import { useRecipeContext } from "../hooks/useRecipeContext";
import Loading from "../components/Loading";

const UserProfile = ({ setShowNavbar }) => {

    // NOTE: USE STATES
    const navigate = useNavigate()
    const [singleUser, setSingleUser] = useState(null)
    // const [recipes, setRecipes] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [userID, setUserID] = useState(null)
    const [popUp, setPopUp] = useState(0)
    const { user, dispatch } = useAuthContext()
    const { recipes, dispatch: recipeDispatch } = useRecipeContext()
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true);

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // NOTE: ADDING TIME FOR LOADING
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    useEffect(() => {
        var userID = null

        const fetchUser = async () => {
            const email = user.email
            const response = await fetch('http://localhost:4000/user/single-user', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({email})
            })
            const json = await response.json()

            if (response.ok) {
                userID = json._id
                setSingleUser(json)
            }
        }

        const usersRecipes = async () => {
            try {
                const response = await fetch('http://localhost:4000/recipes') // FIXME: REMOVE FULL URL
                const json = await response.json()

                // CHECKING IF RESPONSE IS OKAY
                if (response.ok) {
                    const recipeArray = []
                    // CHECKS ALL RECIPES IF THE RECIPES STATUS IS NOT DENIED
                    for (var i = 0; i < json.length; i++) {
                        if (userID && json[i].postedBy.toString() === userID.toString()) {
                            recipeArray.push(json[i])
                        }
                    }
                    // ADDING ALL USER RECIPES
                    // setRecipes(recipeArray)
                    recipeDispatch({type: "SET_RECIPES", payload: recipeArray})
                }
            } catch (err) {
                console.log(err)
            }
        }

        if (user) {
            fetchUser()
            usersRecipes()
        }
    }, [])

    // NOTE: HANDLING DELETION OF RECIPE ----------------------------------------------------------
    const handleDelete = async (e, id) => {
        e.preventDefault()
        if (user) {
            const response = await fetch(`http://localhost:4000/recipes/` + id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                method: 'DELETE',
            });

            const json = await response.json()

            if (!response.ok) {
                setError(json.error || "Could not delete recipe!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }

            if (response.ok) {
                console.log(json)
                recipeDispatch({type: "DELETE_RECIPE", payload: json})
                setMessage("Recipe has been deleted successfully!")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                setPopUp(0)
            }
        }
    } 

    // NOTE: DELETE USER --------------------------------------------------------------------------
    const deleteUser = async (e, id) => {
        e.preventDefault()
        if (user) {
            try {
                const response = await fetch('http://localhost:4000/user/delete-user/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()

                if (response.ok) {
                    console.log(json)
                    setPopUp(0)
                    // NOTE: REMOVE USER FROM LOCAL STORAGE
                    localStorage.removeItem('user')
                    // NOTE: DISPATCH LOGOUT ACTION
                    dispatch({type: 'LOGOUT'})
                    navigate('/')
                }
            } catch (err) {
                console.log(err)
            }
        }
    }


    return (
        <div className="add-recipe-box">
            <h1>User Profile</h1>
            <div className="all-users-container">
            {user && singleUser &&
                <div className="single-user-info">
                    <i className="fas fa-user"></i>
                    <p className="username">{singleUser.username}</p>
                    <p><b>Email: </b>{singleUser.userEmail}</p>
                    <p><b>Role: </b>{singleUser.role}</p>
                    <div className="action-container">
                    {singleUser.role === 'admin'
                        ?
                        <button className="del-btn" disabled><i className="fas fa-trash"></i> Delete Account</button>
                        :
                        <button className="del-btn" onClick={(e) => setPopUp(2) + setUserID(singleUser._id)}><i className="fas fa-trash"></i> Delete Account</button>
                    }
                    </div>
                </div>
            }
            </div>
            <h2 className="users-recipes-title">Manage recipes created by you!</h2>
            <div className="users-recipes">
                {isLoading === false 
                    ?
                    recipes && recipes.length !== 0
                        ?
                        recipes.map((recipe) => (
                            <div className="own-recipe-container">
                            <Link to={'/recipes/' + recipe._id}>
                                <h3 className='username'>{recipe.title}</h3>
                            </Link>
                            <p><b>Created at: </b>{new Date(recipe.createdAt).toDateString()}</p>
                            <p><b>Status: </b><span className={recipe.approvalStatus === 'pending' ? 'status-style-pending' : recipe.approvalStatus === 'approved' ? 'status-style-approved' : 'status-style-denied'}>{recipe.approvalStatus}</span></p>
                            <div className="action-container">
                                <button className="del-btn" onClick={(e) => setPopUp(1) + setSelectedId(recipe._id)}><i className="fas fa-trash"></i> Delete recipe</button>
                            </div>
                        </div>
                        ))
                        :
                        <div className="own-recipe-container">
                            <p>You do not have any recipes to display!</p>
                        </div>
                    : Array.from({length: 10 }, (_, i) => <Loading key={i}/>)
                }
            </div>
            {popUp === 1 &&
                <div className="pop-up-background">
                    <div className="pop-up-message">
                        <h3>Deleting recipe</h3>
                        <p>Are you sure you would like to delete the recipe?</p>
                        <div className="action-container">
                            <button className='del-btn' onClick={(e) => handleDelete(e, selectedId)}>Yes, delete the recipe</button>
                            <button onClick={(e) => setPopUp(0)}>No, keep the recipe</button>
                        </div>
                    </div>
                </div>
            }
            {popUp === 2 &&
                <div className="pop-up-background">
                    <div className="pop-up-message">
                        <h3>Deleting user</h3>
                        <p>Are you sure you would like to delete your account?</p>
                        <p>The deletion is permanent! If you wish to delete your recipes and comments as well
                            please make sure they are deleted before you delete your account, otherwise they will
                            be kept on the site.
                        </p>
                        <div className="action-container">
                            <button className='del-btn' onClick={(e) => deleteUser(e, userID)}>Yes, I would like to delete my account</button>
                            <button onClick={(e) => setPopUp(0)}>Cancel deletion</button>
                        </div>
                    </div>
                </div>
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

export default UserProfile