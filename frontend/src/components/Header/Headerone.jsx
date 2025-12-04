import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose, IoCart } from 'react-icons/io5';
import './Headerone.css';
import Button from '../UI/Button';

const Headerone = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <span className="logo-icon">🍽️</span>
                    <span className="logo-text">SmartSync</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav desktop-nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/browse"
                        className={`nav-link ${isActive('/browse') ? 'active' : ''}`}
                    >
                        Browse
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                    >
                        Contact
                    </Link>
                </nav>

                {/* Actions */}
                <div className="header-actions">
                    {/* Cart Icon */}
                    <Link to="/cart" className="icon-btn cart-btn">
                        <IoCart />
                        <span className="cart-badge">3</span>
                    </Link>

                    {/* User Menu */}
                    <div className="user-menu">
                        <Link to="/login">
                            <Button variant="ghost" size="small">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="small">
                                Sign Up
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <nav className="mobile-nav">
                            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                Home
                            </Link>
                            <Link to="/browse" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                Browse
                            </Link>
                            <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                About
                            </Link>
                            <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                Contact
                            </Link>
                            <Link to="/cart" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                Cart
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Headerone;
