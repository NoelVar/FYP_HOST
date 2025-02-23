import { useState } from "react";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";

const Login = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO FALSE -------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(false);
    }, [])

    // NOTE: SETTING USE STATES -------------------------------------------------------------------
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // NOTE: HANDLING LOGIN FUNCTION --------------------------------------------------------------
    const handleLogin = (e) => {
        console.log("Submited: " + username + ", " + password)
    }

    return (
        <div className="auth-box">
            <div className="auth-container">
                <h2 className="title">Login</h2>
                <from onSubmit={handleLogin()}>
                    <div className="input-container">
                        <label>Username: </label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
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
                    <button 
                    type="submit"
                    className="btn auth-btn">
                        Login
                    </button>
                </from>
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