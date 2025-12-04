import React, { useState, useEffect } from 'react';
import { IoStatsChart, IoRestaurant, IoTime, IoWallet } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatsCard from '../../components/Dashboard/StatsCard';
import OrderList from '../../components/Dashboard/OrderList';
import Modal from '../../components/UI/Modal';
import { getOrders, getCookingRecommendation, updateOrder } from '../../api/api';
import './Dashboard.css';

const RestaurantDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrderId, setLoadingOrderId] = useState(null);
    const [stats, setStats] = useState([
        { title: 'Total Earnings', value: '₹0', icon: <IoWallet />, trend: 0, color: 'success' },
        { title: 'Active Orders', value: '0', icon: <IoRestaurant />, trend: 0, color: 'primary' },
        { title: 'Total Orders', value: '0', icon: <IoStatsChart />, trend: 0, color: 'primary' },
    ]);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        content: null
    });

    const handleGetAdvice = async (orderId) => {
        try {
            setLoadingOrderId(orderId);
            const response = await getCookingRecommendation(orderId);
            setModalConfig({
                isOpen: true,
                title: 'Cooking Advice',
                content: response.data.recommendation
            });
        } catch (error) {
            console.error('Error fetching advice:', error);
            setModalConfig({
                isOpen: true,
                title: 'Error',
                content: 'Failed to get cooking advice.'
            });
        } finally {
            setLoadingOrderId(null);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setLoading(true);
            await updateOrder(orderId, { status: newStatus });
            closeModal();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderId, currentStatus) => {
        const statuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

        const content = (
            <div className="status-selection">
                <p>Current Status: <strong>{currentStatus}</strong></p>
                <p>Select new status:</p>
                <div className="status-buttons">
                    {statuses.map(status => (
                        <button
                            key={status}
                            className={`status-btn ${status.toLowerCase() === currentStatus.toLowerCase() ? 'active' : ''}`}
                            onClick={() => handleStatusUpdate(orderId, status)}
                            disabled={status === currentStatus}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        );

        setModalConfig({
            isOpen: true,
            title: 'Update Order Status',
            content: content
        });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

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
                <OrderList
                    orders={formattedOrders}
                    title="Recent Orders"
                    onAction={handleGetAdvice}
                    actionLabel="Get Cooking Advice"
                    loadingOrderId={loadingOrderId}
                    onStatusChange={handleStatusChange}
                />
            </div>


            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
            >
                {modalConfig.content}
            </Modal>
        </DashboardLayout >
    );
};

export default RestaurantDashboard;
