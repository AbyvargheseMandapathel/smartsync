import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHome, IoRestaurant, IoCart, IoSettings, IoLogOut, IoStatsChart, IoList, IoPersonCircle } from 'react-icons/io5';
import './Sidebar.css';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const userLinks = [
        { path: '/user/dashboard', icon: <IoHome />, label: 'Home' },
        { path: '/user/stats', icon: <IoStatsChart />, label: 'Stats' },
        { path: '/user/orders', icon: <IoList />, label: 'My Orders' },
        { path: '/user/favorites', icon: <IoCart />, label: 'Favorites' },
        { path: '/user/settings', icon: <IoSettings />, label: 'Settings' },
    ];

    const restaurantLinks = [
        { path: '/restaurant/dashboard', icon: <IoStatsChart />, label: 'Overview' },
        { path: '/restaurant/orders', icon: <IoList />, label: 'Orders' },
        { path: '/restaurant/menu', icon: <IoRestaurant />, label: 'Menu Management' },
        { path: '/restaurant/profile', icon: <IoPersonCircle />, label: 'Profile' },
        { path: '/restaurant/settings', icon: <IoSettings />, label: 'Settings' },
    ];

    const links = role === 'RESTAURANT' ? restaurantLinks : userLinks;

    return (
        <motion.aside
            className="sidebar"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="sidebar-header">
                <span className="logo-icon">🍽️</span>
                <span className="logo-text">SmartSync</span>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        end
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <IoLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
