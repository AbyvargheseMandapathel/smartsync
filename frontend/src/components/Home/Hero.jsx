import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoRestaurant } from 'react-icons/io5';
import Button from '../UI/Button';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-title">
                            Order Your Favorite <br />
                            <span className="gradient-text">Food Online</span>
                        </h1>
                        <p className="hero-subtitle">
                            Delicious meals delivered to your doorstep in minutes.
                            Fresh, fast, and fantastic!
                        </p>
                        <div className="hero-actions">
                            <Link to="/browse">
                                <Button variant="primary" size="large" icon={<IoRestaurant />}>
                                    Browse Restaurants
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="outline" size="large">
                                    Become a Partner
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="floating-food-1"
                            animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            🍕
                        </motion.div>
                        <motion.div
                            className="floating-food-2"
                            animate={{ y: [20, -20, 20], rotate: [5, -5, 5] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            🍔
                        </motion.div>
                        <motion.div
                            className="floating-food-3"
                            animate={{ y: [-15, 15, -15], rotate: [-3, 3, -3] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            🍜
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
