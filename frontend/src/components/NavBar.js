// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';

// NOTE: NAVBAR -----------------------------------------------------------------------------------
const NavBar = ({ role }) => {

    // NOTE: VARIABLES
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    // NOTE: NAVIGATION BAR RENDERING -------------------------------------------------------------
    return (
        <header>
            <div className='navbar-container'>
                <div className='logo-container'>
                    <Link to='/'><img src='ED2_LOGOV6.png' alt='EdibleEducation logo' /></Link>
                    <i className='fa fa-bars menu-toggle'></i>
                </div>
                <ul>
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