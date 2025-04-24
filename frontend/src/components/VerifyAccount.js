// IMPORTS ----------------------------------------------------------------------------------------
import { useLayoutEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// VERIFY ACCOUNT FUNCTION ------------------------------------------------------------------------
const VerifyAccount = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE 
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    // ESTABLISHING VARIABLES
    const navigate = useNavigate();
    const [code, setCode] = useState('')
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    // HANDLING VERIFICATION FUNCTION
    const handleVerification = async (e) => {
        e.preventDefault()
        // CHECKING IF THE USER IS LOGGED IN
        if (user) {
            // ESTABLISHING USERS EMAIL FROM USER OBJECT
            const email = user.email
            try {
                // SENDING REQUEST TO BACKEND API
                const response = await fetch('https://edibleeducation-backend.up.railway.app/user/verify', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
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
            // CATCHING ERRORS
            } catch (error) {
                setError(error)
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        // IF THE USER IS NOT LOGGED IN ERROR MESSAGE IS SENT
        } else {
            setError("You are not logged in!")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
    }

    return (
        <div className="verify-account">
            <form onSubmit={handleVerification}>
                <h3>2-Step Verification</h3>
                <p>Enter your 6 digit code from the recieved email.</p>
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

// END OF DOCUMENT --------------------------------------------------------------------------------