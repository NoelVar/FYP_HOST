import { useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const VerifyAccount = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    const navigate = useNavigate();
    const [code, setCode] = useState('')
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleVerification = async (e) => {
        e.preventDefault()

        const email = user.email
        console.log(code)
        try {
            // SENDING REQUEST TO BACKEND API
            const response = await fetch('http://localhost:4000/user/verify', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, veriCode: code })
            })
            const json = await response.json()

            // VALIDATING RESPONSE
            if (!response.ok) {
                setError(json.error)
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
            if (response.ok) {
                // SETTING STATE VARIABLES
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                setTimeout(() => navigate('/'), 2000)
            }
        } catch (error) {
            setError(error)
        }
    }

    return (
        <div className="verify-account">
            <form onSubmit={handleVerification}>
                <h3>Verify your Email address</h3>
                <p>Please check your spam folder if you dont seem to recieve the verification code!</p>
                <div className="single-section">
                <label>
                    Verification Code
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value)}}
                    placeholder="Please enter your verification code..."
                />
                </div>
                <button className="submit-btn" type="submit">Verify Account</button>
            </form>
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

export default VerifyAccount