// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRecipeContext } from "../hooks/useRecipeContext";

// ALL USER PROFILES FUNCTION ---------------------------------------------------------------------
const AllUserProfiles = ({ setShowNavbar, role }) => {

    // VARIABLES
    const { user } = useAuthContext()
    const { recipes: users, dispatch } = useRecipeContext()
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [filterStatus, setFilterStatus] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [popUp, setPopUp] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    
    // NOTE: SETTING NAV BAR TO TRUE
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // FETCHING ALL USERS
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('https://edibleeducation-backend.up.railway.app/user/all-users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            })
            const json = await response.json()

            // CHECKING IF RESPONSE IS NOT OK
            if (!response.ok) {
                setError(json.error || "Could not retrieve users!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }

            // RE USING RECIPE CONTEXT TO KEEP USERS UPDATED CONSTANTLY
            if (response.ok) {
                dispatch({type: "SET_RECIPES", payload: json})
            }
        }

        // ONLY FETHICNG RECIPES IF ROLE IS ADMIN
        if (role && role === 'admin') {
            fetchUser()
        }
    }, [])


    // NOTE: DELETE USER --------------------------------------------------------------------------
    const handleDelete = async (e, id) => {
        e.preventDefault()
        if (user) {
            try {
                const response = await fetch('https://edibleeducation-backend.up.railway.app/user/delete-user/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const json = await response.json()

                // VALIDATING RESPONSE (WENT WRONG)
                if (!response.ok) {
                    setError(json.error || "Could not delete user!")
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                }

                // VALIDATING RESPONSE (OK)
                if (response.ok) {
                    dispatch({type: "DELETE_RECIPE", payload: json})
                    setMessage("User has been deleted successfully!")
                    setTimeout(() => {
                        setMessage(null)
                    }, 4000)
                    setSelectedId(null)
                    setPopUp(false)
                }
            // CATCHING ERRORS IF ANY OCCOURED
            } catch (err) {
                console.log(err)
            }
        }
    }

    // NOTE: HANDLING CHANGE IN STATUS ------------------------------------------------------------
    const handleChange = async (e, id) => {
        e.preventDefault()
        if (user) {
            try {
                const response = await fetch('https://edibleeducation-backend.up.railway.app/user/update-status/' + id, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({role: selectedStatus})
                })

                const json = await response.json()

                // VALIDATING RESPONSE (WENT WRONG)
                if (!response.ok) {
                    setError(json.error || "Could not update user's role!")
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                }

                // VALIDATING RESPONSE (OK)
                if (response.ok) {
                    setMessage("User role has been updated successfully!")
                    setTimeout(() => {
                        setMessage(null)
                    }, 4000)
                    setSelectedStatus(null)
                    dispatch({type: "UPDATE_RECIPE", payload: json})
                }

            // CATCHING ERRORS
            } catch (err) {
                console.error(err)
            }
        }
    }
    
    // NOTE: CLEARING FILTERS ---------------------------------------------------------------------
    const handleClear = () => {
        setFilterStatus(null)
    }

    return (
        <div className="add-recipe-box">
            <h1>All user profiles</h1>
            <form className="filter-management">
                <select onChange={(e) => setFilterStatus(e.target.value)}>
                    <option selected hidden>Filter by role</option>
                    <option value='admin'>admin</option>
                    <option value='moderator'>moderator</option>
                    <option value='user'>user</option>
                </select>
                <div className="filter-action">
                    <input type="reset" onClick={handleClear}></input>
                </div>
            </form>
            <div className="all-users-container">
            {users && users.map((user) => {
                if (filterStatus && user.role === filterStatus) {
                    return (
                        <div className="user-info-container">
                            <h3 className='username'>{user.username}</h3>
                            <p><b>Email: </b>{user.email}</p>
                            <p><b>Role: </b><span className={user.role === 'user' ? 'role-style-user' : user.role === 'moderator' ? 'role-style-moderator': 'role-style-admin'}>{user.role}</span></p>
                            <p><b>Status: </b><span style={{ color: user.status === 'verified' ? 'green' : 'red' }}>{user.status}</span></p>
                            <p><b>Account created at: </b>{new Date(user.createdAt).toDateString()}</p>
                            {user.role === 'admin' 
                                ?
                                    <form>
                                        <select>
                                            <option value="none" selected disabled hidden>Change role</option>
                                            <option value="none" disabled>Cannot change role</option>
                                        </select>
                                    </form>
                                :
                                    <form>
                                        <select onChange={(e) => setSelectedStatus(e.target.value)}>
                                            <option value="none" selected disabled hidden>Change role</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="user">User</option>
                                        </select>
                                    </form>
                            }
                            {user.role === 'admin' 
                                ?
                                    <div className="action-container">
                                        <button className="edit-btn" disabled><i className="fas fa-edit"></i> Edit role</button>
                                        <button className="del-btn" disabled><i className="fas fa-trash"></i> Delete user</button>
                                    </div>
                                :
                                    <div className="action-container">
                                        <button className="edit-btn" onClick={(e) => handleChange(e, user._id)}><i className="fas fa-edit"></i> Edit role</button>
                                        <button className="del-btn" onClick={(e) => setPopUp(true) + setSelectedId(user._id)}><i className="fas fa-trash"></i> Delete user</button>
                                    </div>
                            }
                        </div>
                    )
                }else if (!filterStatus) {
                    return (
                        <div className="user-info-container">
                            <h3 className='username'>{user.username}</h3>
                            <p><b>Email: </b>{user.email}</p>
                            <p><b>Role: </b><span className={user.role === 'user' ? 'role-style-user' : user.role === 'moderator' ? 'role-style-moderator': 'role-style-admin'}>{user.role}</span></p>
                            <p><b>Status: </b><span style={{ color: user.status === 'verified' ? 'green' : 'red' }}>{user.status}</span></p>
                            <p><b>Account created at: </b>{new Date(user.createdAt).toDateString()}</p>
                            {user.role === 'admin' 
                                ?
                                    <form>
                                        <select>
                                            <option value="none" selected disabled hidden>Change role</option>
                                            <option value="none" disabled>Cannot change role</option>
                                        </select>
                                    </form>
                                :
                                    <form>
                                        <select onChange={(e) => setSelectedStatus(e.target.value)}>
                                            <option value="none" selected disabled hidden>Change role</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="user">User</option>
                                        </select>
                                    </form>
                            }
                            {user.role === 'admin' 
                                ?
                                    <div className="action-container">
                                        <button className="edit-btn" disabled><i className="fas fa-edit"></i> Edit role</button>
                                        <button className="del-btn" disabled><i className="fas fa-trash"></i> Delete user</button>
                                    </div>
                                :
                                    <div className="action-container">
                                        <button className="edit-btn" onClick={(e) => handleChange(e, user._id)}><i className="fas fa-edit"></i> Edit role</button>
                                        <button className="del-btn" onClick={(e) => setPopUp(true) + setSelectedId(user._id)}><i className="fas fa-trash"></i> Delete user</button>
                                    </div>
                            }
                        </div>
                    )
                }
            })}
            </div>
            {popUp && 
                <div className="pop-up-background">
                    <div className="pop-up-message">
                        <h3>Deleting user</h3>
                        <p>Are you sure you would like to delete this user?</p>
                        <div className="action-container">
                            <button className='del-btn' onClick={(e) => handleDelete(e, selectedId)}>Yes, delete the user</button>
                            <button onClick={(e) => setPopUp(false)}>No, keep the user</button>
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

export default AllUserProfiles

// END OF DOCUMENT --------------------------------------------------------------------------------