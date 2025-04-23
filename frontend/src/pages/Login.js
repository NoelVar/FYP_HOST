// IMPORTS ----------------------------------------------------------------------------------------
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext"

// LOGIN ------------------------------------------------------------------------------------------
const Login = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO FALSE -------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(false);
    }, [])

    // NOTE: SETTING USE STATES -------------------------------------------------------------------
    const navigate = useNavigate();
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()
    
    // NOTE: HANDLING LOGIN FUNCTION --------------------------------------------------------------
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const json = await response.json()

            // VALIDATING RESPONSE
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                // NOTE: SAVE THE USER TO LOCAL STORAGE
                var now = new Date().getTime();
                localStorage.setItem('user', JSON.stringify(json))
                localStorage.setItem('loggedInTime', now)

                // NOTE: UPDATE AUTH CONTEXT
                dispatch({ type: 'LOGIN', payload: json })

                // SETTING STATE VARIABLES
                setIsLoading(false)
                setLoggedIn(true)
                setError(null)
                setTimeout(() => navigate('/'), 2000)
            } 
        } catch (error) {
            setError(error)
        }
    }

    return (
        <div className="auth-box">
            <div className="auth-container">
                <h2 className="title">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label>Email: </label>
                        <input
                            type="email"
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-container">
                        <label>
                            Password:
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {loggedIn && <div className="success-message">You are now logged in! Redirecting to Home.</div>}
                    <button 
                        disabled={isLoading}
                        type="submit"
                        className="btn auth-btn">
                        Login
                    </button>
                </form>
                <div className="auth-switch">
                    <p className="line"><span>OR</span></p>
                    <p className="auth-switch-link">Sign up <Link to='/signup'>HERE</Link></p>
                </div>
            </div>
            <img src="ED2_LOGOV5.png" alt="icon" className="login-image"/>
        </div>
    )
}

export default Login

// END OF DOCUMENT --------------------------------------------------------------------------------