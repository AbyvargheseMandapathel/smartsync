import React, { useState, useEffect } from 'react';
import { IoTime, IoRestaurant, IoCheckmarkCircle, IoCloseCircle, IoBicycle } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import { getOrders } from '../../api/api';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PENDING': return { color: 'warning', icon: <IoTime />, label: 'Pending' };
            case 'PREPARING': return { color: 'info', icon: <IoRestaurant />, label: 'Preparing' };
            case 'READY': return { color: 'primary', icon: <IoCheckmarkCircle />, label: 'Ready for Pickup' };
            case 'DELIVERED': return { color: 'success', icon: <IoBicycle />, label: 'Delivered' };
            case 'CANCELLED': return { color: 'error', icon: <IoCloseCircle />, label: 'Cancelled' };
            default: return { color: 'default', icon: <IoTime />, label: status };
        }
    };

    return (
        <DashboardLayout role="USER">
            <div className="user-orders-header">
                <h1>My Orders</h1>
                <p>Track your current and past orders</p>
            </div>

            <div className="user-orders-list">
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                    orders.map(order => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                            <Card key={order.id} className="user-order-card">
                                <div className="order-card-header">
                                    <div className="restaurant-info">
                                        <div className="restaurant-icon">
                                            <IoRestaurant />
                                        </div>
                                        <div>
                                            <h3>{order.restaurant_name}</h3>
                                            <span className="order-date">
                                                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`order-status-badge ${statusConfig.color}`}>
                                        {statusConfig.icon}
                                        <span>{statusConfig.label}</span>
                                    </div>
                                </div>

                                <div className="order-items-summary">
                                    {order.items.map(item => (
                                        <div key={item.id} className="order-item-line">
                                            <span className="item-qty">{item.quantity}x</span>
                                            <span className="item-name">{item.menu_item_name}</span>
                                            <span className="item-price">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-total">
                                        <span>Total Amount</span>
                                        <strong>₹{order.total_amount}</strong>
                                    </div>
                                    {/* Future: Add 'Reorder' or 'Track' buttons here */}
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className="no-orders">
                        <IoRestaurant className="no-orders-icon" />
                        <h3>No orders yet</h3>
                        <p>Explore restaurants and place your first order!</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserOrders;
