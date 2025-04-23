// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

// NOTE: NAVBAR -----------------------------------------------------------------------------------
const NavBar = ({ role }) => {

    // NOTE: VARIABLES
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const [toggle, setToggle] = useState(false)
    const navigate = useNavigate()
    
    const handleClick = () => {
        logout()
        navigate('/')
    }

    const handleToggle = (e) => {
        e.preventDefault()
        setToggle(!toggle)
        console.log("pressed")
    }

    // NOTE: NAVIGATION BAR RENDERING -------------------------------------------------------------
    return (
        <header>
            <div className='navbar-container'>
                <div className='logo-container'>
                    <Link to='/'><img src='/ED2_LOGOV6.png' alt='EdibleEducation logo' /></Link>
                    <i className='fa fa-bars menu-toggle' onClick={handleToggle}></i>
                </div>
                { toggle ?
                    <div className='navigation-menu'>
                        <ul className='mobile-list' onClick={handleToggle}>
                            <div className='navigation-left'>
                                <li>
                                    <Link to='/'>Home</Link>
                                </li>
                                <li>
                                    <Link to='/recipes'>Recipes</Link>
                                </li>
                                {user && (role === 'admin' || role === 'moderator') &&
                                    <li>
                                        <Link to='/manage-recipes'>Manage recipes</Link>
                                    </li>
                                }
                                {user && role === 'admin' &&
                                    <li>
                                        <Link to='/all-users'>User Profiles</Link>
                                    </li>
                                }
                            </div>
                            {/* ONLY SHOWING IF USER IS NOT LOGGED IN */}
                            {!user && (
                                <li className='right'>
                                    <Link to='login'>
                                        Login
                                    </Link>
                                </li>
                            )}
                            {/* ONLY SHOWING IF USER IS LOGGED IN */}
                            {user && (
                                <div>
                                <li className='right'>
                                    <Link to='/my-profile'>
                                        <i className='fa fa-user'></i>
                                        &nbsp;
                                        {user.username}
                                        &nbsp;
                                        <i className='fa fa-chevron-down'></i>
                                    </Link>                                                                                                            
                                </li>
                                <li>
                                    <button onClick={handleClick} className='logout-button'>Logout</button>
                                </li>
                                </div>
                            )}
                        </ul>
                    </div>
                :
                    <div></div>
                }
                <ul className='navigation-list'>
                    <div className='navigation-left'>
                        <li>
                            <Link to='/'>Home</Link>
                        </li>
                        <li>
                            <Link to='/recipes'>Recipes</Link>
                        </li>
                        {user && (role === 'admin' || role === 'moderator') &&
                            <li>
                                <Link to='/manage-recipes'>Manage recipes</Link>
                            </li>
                        }
                        {user && role === 'admin' &&
                            <li>
                                <Link to='/all-users'>User Profiles</Link>
                            </li>
                        }
                    </div>
                    {/* ONLY SHOWING IF USER IS NOT LOGGED IN */}
                    {!user && (
                        <li className='right'>
                            <Link to='login'>
                                Login
                            </Link>
                        </li>
                    )}
                    {/* ONLY SHOWING IF USER IS LOGGED IN */}
                    {user && (
                        <li className='right'>
                            <Link to='/my-profile'>
                                <i className='fa fa-user'></i>
                                &nbsp;
                                {user.username}
                                &nbsp;
                                <i className='fa fa-chevron-down'></i>
                            </Link>
                            <ul>
                                <li>
                                    <button onClick={handleClick} className='logout-button'>Logout</button>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    )
}

export default NavBar

// END OF DOCUMENT --------------------------------------------------------------------------------