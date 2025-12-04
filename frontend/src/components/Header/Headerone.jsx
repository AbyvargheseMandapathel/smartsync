import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Headerone.css';

const Headerone = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('access');

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">SmartSync</Link>
            </div>
            <nav className="nav-links">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Headerone;
