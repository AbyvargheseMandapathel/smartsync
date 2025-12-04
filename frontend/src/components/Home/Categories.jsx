import React from 'react';
import { motion } from 'framer-motion';
import './Categories.css';

const Categories = () => {
    const categories = [
        { id: 'pizza', name: '🍕 Pizza', color: '#f97316' },
        { id: 'burger', name: '🍔 Burgers', color: '#ef4444' },
        { id: 'asian', name: '🍜 Asian', color: '#f59e0b' },
        { id: 'healthy', name: '🥗 Healthy', color: '#10b981' },
        { id: 'dessert', name: '🍰 Desserts', color: '#ec4899' },
        { id: 'drinks', name: '🥤 Drinks', color: '#8b5cf6' },
    ];

    return (
        <section className="categories-section">
            <div className="container">
                <div className="section-header">
                    <h2>Popular Categories</h2>
                    <p>What are you craving today?</p>
                </div>
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="category-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            style={{ '--category-color': category.color }}
                        >
                            <span className="category-emoji">{category.name.split(' ')[0]}</span>
                            <span className="category-name">{category.name.split(' ')[1]}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
