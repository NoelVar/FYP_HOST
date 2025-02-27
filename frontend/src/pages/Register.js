import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import axios from 'axios';

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
    const {signup, isLoading, error} = useSignup()
    
    // NOTE: HANDLING LOGIN FUNCTION --------------------------------------------------------------
    const handleLogin = async (e) => {
        e.preventDefault()
        
        await signup(username, userEmail, password, confirmPassword)

        navigate('/')
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
                    {error && <div className="error">{error}</div>}
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