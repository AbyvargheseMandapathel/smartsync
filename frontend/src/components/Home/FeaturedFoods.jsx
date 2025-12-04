import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import FoodCard from '../Food/FoodCard';
import Button from '../UI/Button';
import './FeaturedFoods.css';

const FeaturedFoods = () => {
    const featuredFoods = [
        {
            id: 1,
            name: 'Margherita Pizza',
            description: 'Fresh tomatoes, mozzarella, and basil',
            price: 12.99,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
            isVeg: true,
            discount: 20
        },
        {
            id: 2,
            name: 'Classic Burger',
            description: 'Juicy beef patty with cheese and veggies',
            price: 9.99,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            isVeg: false,
        },
        {
            id: 3,
            name: 'Chicken Ramen',
            description: 'Japanese noodles in savory broth',
            price: 14.99,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            isVeg: false,
            discount: 15
        },
        {
            id: 4,
            name: 'Caesar Salad',
            description: 'Crisp romaine with parmesan and croutons',
            price: 8.99,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
            isVeg: true,
        },
    ];

    return (
        <section className="featured-section">
            <div className="container">
                <div className="section-header">
                    <h2>Featured Dishes</h2>
                    <p>Hand-picked favorites from our best restaurants</p>
                </div>
                <div className="food-grid">
                    {featuredFoods.map((food, index) => (
                        <motion.div
                            key={food.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FoodCard
                                {...food}
                                onAddToCart={() => console.log('Added to cart:', food.name)}
                            />
                        </motion.div>
                    ))}
                </div>
                <div className="section-action">
                    <Link to="/browse">
                        <Button variant="ghost" size="large" icon={<IoArrowForward />}>
                            View All Dishes
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedFoods;
