import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, trend, color = 'primary' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`stats-card ${color}`}>
                <div className="stats-icon-wrapper">
                    {icon}
                </div>
                <div className="stats-content">
                    <h3 className="stats-title">{title}</h3>
                    <div className="stats-value">{value}</div>
                    {trend && (
                        <div className={`stats-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default StatsCard;
