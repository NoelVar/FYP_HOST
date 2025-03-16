import { useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const AllUserProfiles = ({ setShowNavbar, role }) => {

    const [users, setUsers] = useState(null)
    

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    useEffect(() => {
            const fetchUser = async () => {
                const response = await fetch('http://localhost:4000/user/all-users')
                const json = await response.json()
    
                if (response.ok) {
                    setUsers(json)
                }
            }
    
            if (role && role === 'admin') {
                fetchUser()
            }
        }, [])

    return (
        <div className="add-recipe-box">
            <h1>All user profiles</h1>
            <div className="all-users-container">
            {users && users.map((user) => (
                <div className="user-info-container">
                    <h3 className='username'>{user.username}</h3>
                    <p><b>Email: </b>{user.email}</p>
                    <p><b>Role: </b><span className={user.role === 'user' ? 'role-style-user' : user.role === 'moderator' ? 'role-style-moderator': 'role-style-admin'}>{user.role}</span></p>
                    <p><b>Account created at: </b>{new Date(user.createdAt).toDateString()}</p>
                    {user.role === 'admin' ?
                    <div className="action-container">
                        <button className="edit-btn" disabled><i className="fas fa-edit"></i> Edit role</button>
                        <button className="del-btn" disabled><i className="fas fa-trash"></i> Delete user</button>
                    </div>
                    :
                    <div className="action-container">
                        <button className="edit-btn"><i className="fas fa-edit"></i> Edit role</button>
                        <button className="del-btn"><i className="fas fa-trash"></i> Delete user</button>
                    </div>
                    }
                </div>
            ))}
            </div>
        </div>
    )
}

export default AllUserProfiles