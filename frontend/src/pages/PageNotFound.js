import { Link } from "react-router-dom";
import { useLayoutEffect } from 'react';

const PageNotFound = ({setShowNavbar}) => {

    // NOTE: SETTING NAV BAR TO FALSE -------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(false);
    }, [])

    return (
        <div className="not-found">
            <div className="not-found-message">
                <h1 className="not-found-title">Ooops</h1>
                <h2>ERROR 404 - Page not found!</h2>
                <p>You might have gotten lost, let me help you find your way back home!</p>
                <Link to='/'>Home</Link>
            </div>
            <div className="not-found-img">
                <img src="ErrorRat.png" alt="Mascot being confused."/>
            </div>
        </div>
    )
}

export default PageNotFound

// END OF DOCUMENT --------------------------------------------------------------------------------