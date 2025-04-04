import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Footer from "../components/Footer";

const UserProfile = ({ setShowNavbar }) => {

    // NOTE: USE STATES
    const [singleUser, setSingleUser] = useState(null)
    const [recipes, setRecipes] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [popUp, setPopUp] = useState(false)
    const { user } = useAuthContext()

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
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
                    setRecipes(recipeArray)
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

            if (response.ok) {
                setPopUp(false)
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
                    <p className="username">{user.username}</p>
                    <p><b>Email: </b>{singleUser.userEmail}</p>
                    <p><b>Role: </b>{singleUser.role}</p>
                </div>
            }
            </div>
            <h2 className="users-recipes-title">Manage recipes created by you!</h2>
            <div className="users-recipes">
                {recipes && 
                    recipes.map((recipe) => (
                        <div className="own-recipe-container">
                        <Link to={'/recipes/' + recipe._id}>
                            <h3 className='username'>{recipe.title}</h3>
                        </Link>
                        <p><b>Created at: </b>{new Date(recipe.createdAt).toDateString()}</p>
                        <p><b>Status: </b><span className={recipe.approvalStatus === 'pending' ? 'status-style-pending' : recipe.approvalStatus === 'approved' ? 'status-style-approved' : 'status-style-denied'}>{recipe.approvalStatus}</span></p>
                        <div className="action-container">
                            <button className="del-btn" onClick={(e) => setPopUp(true) + setSelectedId(recipe._id)}><i className="fas fa-trash"></i> Delete recipe</button>
                        </div>
                    </div>
                    ))
                }
            </div>
            {popUp && 
                <div className="pop-up-background">
                    <div className="pop-up-message">
                        <h3>Deleting recipe</h3>
                        <p>Are you sure you would like to delete the recipe?</p>
                        <div className="action-container">
                            <button className='del-btn' onClick={(e) => handleDelete(e, selectedId)}>Yes, delete the recipe</button>
                            <button onClick={(e) => setPopUp(false)}>No, keep the recipe</button>
                        </div>
                    </div>
                </div>
            }
            <Footer />
        </div>
    )
    
}

export default UserProfile