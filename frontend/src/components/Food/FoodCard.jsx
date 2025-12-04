import React from 'react';
import { motion } from 'framer-motion';
import './FoodCard.css';
import { IoStar, IoAdd } from 'react-icons/io5';

const FoodCard = ({
    image,
    name,
    description,
    price,
    rating = 4.5,
    isVeg = true,
    onAddToCart,
    discount = null,
    className = '',
    ...props
}) => {
    return (
        <motion.div
            className={`food-card ${className}`}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {discount && (
                <div className="food-card-badge">
                    <span>{discount}% OFF</span>
                </div>
            )}

            <div className="food-card-image-wrapper">
                <img src={image} alt={name} className="food-card-image" />
                <div className="food-card-veg-indicator">
                    <div className={`veg-icon ${isVeg ? 'veg' : 'non-veg'}`}></div>
                </div>
            </div>

            <div className="food-card-content">
                <h3 className="food-card-name">{name}</h3>
                <p className="food-card-description">{description}</p>

                <div className="food-card-footer">
                    <div className="food-card-info">
                        <div className="food-card-rating">
                            <IoStar className="star-icon" />
                            <span>{rating}</span>
                        </div>
                        <div className="food-card-price">${price}</div>
                    </div>

                    <motion.button
                        className="food-card-add-btn"
                        onClick={onAddToCart}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IoAdd />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
