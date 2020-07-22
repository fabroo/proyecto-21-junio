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
                    <li className="nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                        Home
                    </li>
                </Link>
                <Link to="/login" className="nav-item">
                    <li className="nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                        Login
                    </li>
                </Link>
                <Link to="/register" className="nav-item">
                    <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                        Register
                    </li>
                </Link>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>

                {user ? (<div className="hola-usuario " style={{ marginRight: '1rem', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <img className="img-fluid" style={{ width: '40px', borderRadius: '50%' }} src={'http://192.168.0.109:5000\\user\\pfp\\' + user.companyID + '\\' + user.dni} alt={user.username} />
                    <p style={{ marginLeft: '.5rem', padding: 0, marginBottom: 0 }}>{user.username}</p>
                </div>) : (null)}
                <Link to="/" className="nav-item">
                    <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                        Home
                    </li>
                </Link>
                {
                    user.role === "admin" ?
                        <Link to="/admin" className="nav-item">
                            <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                                Admin
                        </li>
                        </Link> : user.role === "mod" ? <Link to="/admin" className="nav-item">
                            <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                                Admin
                        </li>
                        </Link> : null
                }
                {
                    user.role === "mod" ? (
                        <Link to="/mod" className="nav-item">
                        <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                            MOD
                </li>
                    </Link>
                    ):null
                }
                <Link className=" nav-item " to="/upload" >
                    
                    <li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
                        Upload
                    </li>
                </Link>
                <Link type="button"
                    className=" nav-item " to="/"
                    onClick={onClickLogoutHandler}><li className=" nav-link" data-toggle="collapse" data-target="#navbarSupportedContent">
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

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                </ul>
            </div>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

        </nav>
    )
}

export default Navbar;