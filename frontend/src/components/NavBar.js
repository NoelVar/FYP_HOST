import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <header>
            <div className='navbar-container'>
                <div className='logo-container'>
                    <Link to='/'><img src='title.png' alt='EdibleEducation' /></Link>
                    <i className='fa fa-bars menu-toggle'></i>
                </div>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/recipes'>Recipes</Link>
                    </li>
                    <li>
                        <Link to='/login'>
                            <i className='fa fa-user'></i>
                            &nbsp;
                            Noel Varga
                            &nbsp;
                            <i className='fa fa-chevron-down'></i>
                        </Link>
                        <ul>
                            <li>
                                <Link to='/asd'>Profile</Link>
                            </li>
                            <li>
                                <Link to='/asd'>Logout</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default NavBar