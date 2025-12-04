import React from 'react';
import { IoCart, IoHeart, IoTime, IoWallet } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatsCard from '../../components/Dashboard/StatsCard';
import './Dashboard.css';

const UserStats = () => {
    const stats = [
        { title: 'Total Orders', value: '24', icon: <IoCart />, trend: 12, color: 'primary' },
        { title: 'Favorites', value: '12', icon: <IoHeart />, trend: 5, color: 'secondary' },
        { title: 'Avg. Wait', value: '25m', icon: <IoTime />, trend: -2, color: 'success' },
        { title: 'Total Spent', value: '$450', icon: <IoWallet />, trend: 8, color: 'primary' },
    ];

    return (
        <DashboardLayout role="USER">
            <div className="dashboard-header">
                <h1>Your Statistics</h1>
                <p>Track your ordering habits and spending.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default UserStats;
