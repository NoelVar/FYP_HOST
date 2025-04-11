import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext"

const Register = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO FALSE -------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(false);
    }, [])

    // NOTE: SETTING USE STATES -------------------------------------------------------------------
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registered, setRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()
    
    // NOTE: HANDLING LOGIN FUNCTION --------------------------------------------------------------
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            // SENDING REQUEST TO BACKEND API
            const response = await fetch('http://localhost:4000/user/register', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, email: userEmail, password, confirmPassword })
            })
            const json = await response.json()

            // VALIDATING RESPONSE
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                // NOTE: SAVE THE USER TO LOCAL STORAGE
                localStorage.setItem('user', JSON.stringify(json))

                // NOTE: UPDATE AUTH CONTEXT
                dispatch({ type: 'LOGIN', payload: json })

                // SETTING STATE VARIABLES
                setIsLoading(false)
                setRegistered(true)
                setError(null)
                setTimeout(() => navigate('/verify-account'), 2000)
            }
        } catch (error) {
            setError(error)
        }
    }

    return (
        <div className="auth-box">
            <div className="auth-container">
                <h2 className="title">Register</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label>Username: </label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter new username..."
                        />
                    </div>
                    <div className="input-container">
                        <label>Email: </label>
                        <input
                            type="email"
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Enter new email..."
                        />
                    </div>
                    <div className="input-container">
                        <label>
                            Password:
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password..."
                        />
                    </div>
                    <div className="input-container">
                        <label>
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Enter password again..."
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {registered && <div className="success-message">You are now registered! Redirecting to verify your email!</div>}
                    <button 
                        disabled={isLoading}
                        type="submit"
                        className="btn auth-btn">
                        Sign up
                    </button>
                </form>
                <div className="auth-switch">
                    <p className="line"><span>OR</span></p>
                    <p className="auth-switch-link">Login <Link to='/login'>HERE</Link></p>
                </div>
            </div>
            <img src="ED2_LOGOV5.png" alt="icon" className="login-image"/>
        </div>
    )
}

export default Register

// END OF DOCUMENT --------------------------------------------------------------------------------