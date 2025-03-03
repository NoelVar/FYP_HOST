import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

const NavBar = () => {

    const { logout } = useLogout()

    const handleClick = () => {
        logout()
    }

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
                    </div>
                    <li className='right'>
                        <Link to='/login'>
                            <i className='fa fa-user'></i>
                            &nbsp;
                            Username
                            &nbsp;
                            <i className='fa fa-chevron-down'></i>
                        </Link>
                        <ul>
                            <li>
                                <Link to='/asd'>Profile</Link>
                            </li>
                            <li>
                                <button onClick={handleClick} className='logout-button'>Logout</button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default NavBar