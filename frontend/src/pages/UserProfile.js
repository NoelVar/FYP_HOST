import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const UserProfile = ({ setShowNavbar }) => {

    // NOTE: USE STATES
    const [singleUser, setSingleUser] = useState(null)
    const { user } = useAuthContext()

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            const email = user.email
            const response = await fetch('http://localhost:4000/user/single-user', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({email})
            })
            const json = await response.json()

            if (response.ok) {
                setSingleUser(json)
            }
        }

        if (user) {
            fetchUser()
        }
    }, [])

    return (
        <div className="add-recipe-box">
            <h1>User Profile</h1>
            <div className="all-users-container">
            {user && singleUser &&
                <div className="user-info-container">
                    <p><b>Username: </b>{singleUser.username}</p>
                    <p><b>Email: </b>{singleUser.userEmail}</p>
                    <p><b>Role: </b>{singleUser.role}</p>
                </div>
            }
            </div>
        </div>
    )
}

export default UserProfile