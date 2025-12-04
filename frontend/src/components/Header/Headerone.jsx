import React from 'react';
import { Link } from 'react-router-dom';
import './Headerone.css';

const Headerone = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">SmartSync</Link>
            </div>
            <nav className="nav-links">
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </nav>
        </header>
    );
};

export default Headerone;
