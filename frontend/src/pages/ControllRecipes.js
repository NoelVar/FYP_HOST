// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { useRecipeContext } from "../hooks/useRecipeContext";
import Loading from "../components/Loading";

// CONTROLL ALL RECIPES FUNCTION 
const ControllRecipes = ({ setShowNavbar, role }) => {
    // VARIABLES
    const { user } = useAuthContext()
    const { recipes, dispatch } = useRecipeContext()
    const [status, setStatus] = useState(null)
    const [popUp, setPopUp] = useState(false)
    const [filterStatus, setFilterStatus] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true);
    

    // NOTE: SETTING NAV BAR TO TRUE
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

     // NOTE: ADDING TIME FOR LOADING
     useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])

    // FETCHING ALL RECIPES
    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('http://localhost:4000/recipes')
            const json = await response.json()

            if (response.ok) {
                // SETTING RECIPES USING RECIPE CONTEXT
                dispatch({type: 'SET_RECIPES', payload: json})
            }
        }

        // ONLY FETCHING RECIPES IF ROLE IS ADMIN OR MOD
        if (role && (role === 'admin' || role === 'moderator')) {
            fetchRecipes()
        }
    }, [])

    // NOTE: HANDLING OPTION CHANGE ---------------------------------------------------------------
    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }

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

            // VALIDATING RESPONSE (WENT WRONG)
            if (!response.ok) {
                setError(json.error || "Could not delete recipe!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
            // VALIDATING RESPONSE (OK)
            if (response.ok) {
                dispatch({type: "DELETE_RECIPE", payload: json})
                setMessage("Recipe has been deleted successfully!")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                setStatus(null)
                setPopUp(false)
            }
        }
    } 
    
    // NOTE: CLEARING FILTERS ---------------------------------------------------------------------
    const handleClear = () => {
        setFilterStatus(null)
    }

    // NOTE: HANDLING CHANGE IN STATUS ------------------------------------------------------------
    const handleChange = async (e, id) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:4000/recipes/' + id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({status})
            })

            const json = await response.json()

            // VALIDATING RESPONSE (WENT WRONG)
            if (!response.ok) {
                setError(json.error || "Could not update status!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }

            // VALIDATING RESPONSE (OK)
            if (response.ok) {
                setMessage("Recipe Status Updated")
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                setStatus(null)
                dispatch({type: "UPDATE_RECIPE", payload: json})
            }

        // CATCHING ERRORS
        } catch (err) {
            console.error(err)
        }
    }
    
    return (
        <div className="add-recipe-box">
            <h1>Manage recipes</h1>
            <form className="filter-management">
                <select onChange={(e) => setFilterStatus(e.target.value)}>
                    <option selected hidden>Filter by status</option>
                    <option value='approved'>approved</option>
                    <option value='pending'>pending</option>
                    <option value='denied'>denied</option>
                </select>
                <div className="filter-action">
                    <input type="reset" onClick={handleClear}></input>
                </div>
            </form>
            <div className="all-recipes-container">
            {isLoading === false 
                ?
                recipes && recipes.map((recipe) => {
                    if (filterStatus && recipe.approvalStatus === filterStatus) {
                        return (
                            <div className="recipe-info-container">
                                <Link to={'/recipes/' + recipe._id}>
                                    {recipe.image
                                        ? <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
                                        : <img src='ED2_LOGOV5.png' />
                                    }
                                    <h3 className='username'>{recipe.title}</h3>
                                </Link>
                                <p><b>Created at: </b>{new Date(recipe.createdAt).toDateString()}</p>
                                <p><b>Status: </b><span className={recipe.approvalStatus === 'pending' ? 'status-style-pending' : recipe.approvalStatus === 'approved' ? 'status-style-approved' : 'status-style-denied'}>{recipe.approvalStatus}</span></p>
                                <form>
                                    <select onChange={(e) => handleStatusChange(e)}>
                                        <option value="none" selected disabled hidden>Change status</option>
                                        <option value="denied">Denied</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                </form>
                                <div className="action-container">
                                    <button className="edit-btn" onClick={(e) => handleChange(e, recipe._id)}><i className="fas fa-edit"></i> Save status</button>
                                    <button className="del-btn" onClick={(e) => setPopUp(true) + setSelectedId(recipe._id)}><i className="fas fa-trash"></i> Delete recipe</button>
                                </div>
                            </div>
                        )
                    } else if (!filterStatus) {
                        return (
                            <div className="recipe-info-container">
                                <Link to={'/recipes/' + recipe._id}>
                                    {recipe.image
                                        ? <img src={`http://localhost:4000/images/` + recipe.image} alt='Recipe cover' />
                                        : <img src='ED2_LOGOV5.png' />
                                    }
                                    <h3 className='username'>{recipe.title}</h3>
                                </Link>
                                <p><b>Created at: </b>{new Date(recipe.createdAt).toDateString()}</p>
                                <p><b>Status: </b><span className={recipe.approvalStatus === 'pending' ? 'status-style-pending' : recipe.approvalStatus === 'approved' ? 'status-style-approved' : 'status-style-denied'}>{recipe.approvalStatus}</span></p>
                                <form>
                                    <select onChange={(e) => handleStatusChange(e)}>
                                        <option value="none" selected disabled hidden>Change status</option>
                                        <option value="denied">Denied</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                </form>
                                <div className="action-container">
                                    <button className="edit-btn" onClick={(e) => handleChange(e, recipe._id)}><i className="fas fa-edit"></i> Save status</button>
                                    <button className="del-btn" onClick={(e) => setPopUp(true) + setSelectedId(recipe._id)}><i className="fas fa-trash"></i> Delete recipe</button>
                                </div>
                            </div>
                        )
                    }
                })
                :
                Array.from({length: 10 }, (_, i) => <Loading key={i}/>)
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
        </div>
    )
}

export default ControllRecipes

// END OF DOCUMENT --------------------------------------------------------------------------------