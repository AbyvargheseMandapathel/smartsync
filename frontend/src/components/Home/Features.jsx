import React from 'react';
import { IoTime, IoRestaurant, IoShield, IoStar } from 'react-icons/io5';
import Card from '../UI/Card';
import './Features.css';

const Features = () => {
    const features = [
        {
            icon: <IoTime />,
            title: 'Fast Delivery',
            description: 'Get your food delivered in 30 minutes or less',
            gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
        },
        {
            icon: <IoRestaurant />,
            title: '500+ Restaurants',
            description: 'Choose from a wide variety of cuisines',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
        },
        {
            icon: <IoShield />,
            title: 'Safe & Hygienic',
            description: '100% contactless and safe delivery',
            gradient: 'linear-gradient(135deg, #10b981, #059669)'
        },
        {
            icon: <IoStar />,
            title: 'Best Quality',
            description: 'Only the freshest ingredients',
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
        }
    ];

    return (
        <section className="features-section">
            <div className="container">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Card key={index} className="feature-card hover-lift">
                            <div className="feature-icon" style={{ background: feature.gradient }}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
