import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';

const Navbar = props => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    }

    const unauthenticatedNavBar = () => {
        return (
            <>
                <Link to="/" className="nav-item">
                    <li className="nav-link">
                        Home
                    </li>
                </Link>
                <Link to="/login" className="nav-item">
                    <li className="nav-link">
                        Login
                    </li>
                </Link>
                <Link to="/register" className="nav-item">
                    <li className=" nav-link">
                        Register
                    </li>
                </Link>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>
                <Link to="/" className="nav-item">
                    <li className=" nav-link">
                        Home
                    </li>
                </Link>
                <Link to="/todos" className="nav-item">
                    <li className=" nav-link">
                        Todos
                    </li>
                </Link>
                {
                    user.role === "admin" ?
                        <Link to="/admin" className="nav-item">
                            <li className=" nav-link">
                                Admin
                        </li>
                        </Link> : null
                }
                <Link className=" nav-item " to="/upload">
                    <li className=" nav-link">
                        Upload
                    </li>
                </Link>
                <Link type="button"
                    className=" nav-item " to="/"
                    onClick={onClickLogoutHandler}><li className=" nav-link">
                        Logout
                    </li>
                </Link>

            </>
        )
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="nav-item">
                <div className="navbar-brand">Leo Mattioli</div>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;