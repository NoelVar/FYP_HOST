import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const ControllRecipes = ({ setShowNavbar, role }) => {
    const { user } = useAuthContext()
    const [recipes, setRecipes] = useState(null)
    const [filteredRecipes, setFilteredRecipes] = useState(null)
    const [status, setStatus] = useState(false)
    const [filterStatus, setFilterStatus] = useState('')
    

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('http://localhost:4000/recipes')
            const json = await response.json()

            if (response.ok) {
                setRecipes(json)
                setFilteredRecipes(json)
            }
        }

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

            if (response.ok) {
                console.log("Deleted: " + id)
            }
        }
    } 

    // NOTE: FILTER RECIPES -----------------------------------------------------------------------
    const filterRecipes = (e) => {
        e.preventDefault()
        var filteredArray = []
        recipes.map((recipe) => {
            if (recipe.approvalStatus === filterStatus) {
                filteredArray.push(recipe)
            }
        })
        setFilteredRecipes(filteredArray)
    }
    
    // NOTE: CLEARING FILTERS ---------------------------------------------------------------------
    const handleClear = () => {
        setFilteredRecipes(recipes)
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

            if (response.ok) {
                console.log(response.json())
            }
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
                    <button className='filter-btn' onClick={filterRecipes}>Filter</button>
                    <input type="reset" onClick={handleClear}></input>
                </div>
            </form>
            <div className="all-recipes-container">
            {filteredRecipes && filteredRecipes.map((recipe) => (
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
                        <button className="edit-btn" onClick={(e) => handleChange(e, recipe._id)}><i className="fas fa-edit"></i> Edit status</button>
                        <button className="del-btn" onClick={(e) => handleDelete(e, recipe._id)}><i className="fas fa-trash"></i> Delete recipe</button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default ControllRecipes