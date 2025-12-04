import React from 'react';
import { motion } from 'framer-motion';
import './Stats.css';

const Stats = () => {
    const stats = [
        { value: '10K+', label: 'Happy Customers' },
        { value: '500+', label: 'Restaurants' },
        { value: '1M+', label: 'Orders Delivered' },
        { value: '50+', label: 'Cities' },
    ];

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                        >
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
