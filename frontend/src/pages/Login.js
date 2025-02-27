import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO FALSE -------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(false);
    }, [])

    // NOTE: SETTING USE STATES -------------------------------------------------------------------
    const navigate = useNavigate();
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading, error} = useLogin()
    
    // NOTE: HANDLING LOGIN FUNCTION --------------------------------------------------------------
    const handleLogin = async (e) => {
        e.preventDefault()
        
        await login(email, password)
        navigate('/')
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
                    {error && <div className="error">{error}</div>}
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