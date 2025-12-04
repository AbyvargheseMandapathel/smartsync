import React, { useState, useEffect } from 'react';
import { IoStatsChart, IoRestaurant, IoTime, IoWallet } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatsCard from '../../components/Dashboard/StatsCard';
import OrderList from '../../components/Dashboard/OrderList';
import { getOrders } from '../../api/api';
import './Dashboard.css';

const RestaurantDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { title: 'Total Earnings', value: '₹0', icon: <IoWallet />, trend: 0, color: 'success' },
        { title: 'Active Orders', value: '0', icon: <IoRestaurant />, trend: 0, color: 'primary' },
        { title: 'Total Orders', value: '0', icon: <IoStatsChart />, trend: 0, color: 'primary' },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getOrders();
            const allOrders = response.data;
            setOrders(allOrders);
            calculateStats(allOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const calculateStats = (ordersData) => {
        const totalEarnings = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        const activeCount = ordersData.filter(o => ['PENDING', 'PREPARING'].includes(o.status)).length;
        const totalCount = ordersData.length;

        setStats([
            { title: 'Total Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: <IoWallet />, trend: 10, color: 'success' },
            { title: 'Active Orders', value: activeCount.toString(), icon: <IoRestaurant />, trend: 0, color: 'primary' },
            { title: 'Total Orders', value: totalCount.toString(), icon: <IoStatsChart />, trend: 5, color: 'primary' },
        ]);
    };

    // Map API orders to OrderList format
    const formattedOrders = orders.slice(0, 5).map(order => ({
        id: order.id.toString(),
        entityName: order.customer_name || 'Customer',
        items: order.items.length,
        total: order.total_amount,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString() + ', ' + new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <DashboardLayout role="RESTAURANT">
            <div className="dashboard-header">
                <h1>Restaurant Overview</h1>
                <p>Track your sales and manage active orders.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-section">
                <OrderList orders={formattedOrders} title="Recent Orders" />
            </div>
        </DashboardLayout>
    );
};

export default RestaurantDashboard;
