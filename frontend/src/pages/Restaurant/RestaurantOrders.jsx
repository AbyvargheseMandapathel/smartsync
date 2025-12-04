import React, { useState, useEffect } from 'react';
import { IoTime, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import { getOrders, updateOrder } from '../../api/api';
import './RestaurantOrders.css';

const RestaurantOrders = () => {
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'PREPARING': return 'info';
            case 'READY': return 'primary';
            case 'DELIVERED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    return (
        <DashboardLayout role="RESTAURANT">
            <div className="orders-header">
                <h1>Incoming Orders</h1>
                <p>Manage and track customer orders</p>
            </div>

            <div className="orders-list">
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length > 0 ? (
                    orders.map(order => (
                        <Card key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <span className="order-time">
                                        <IoTime /> {new Date(order.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item-row">
                                        <span className="quantity">{item.quantity}x</span>
                                        <span className="item-name">{item.menu_item_name}</span>
                                        <span className="item-price">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="total-amount">
                                    <span>Total:</span>
                                    <strong>₹{order.total_amount}</strong>
                                </div>

                                {order.status === 'PENDING' && (
                                    <div className="order-actions">
                                        <button
                                            className="action-btn accept"
                                            onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                                        >
                                            Accept <IoCheckmarkCircle />
                                        </button>
                                        <button
                                            className="action-btn reject"
                                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                        >
                                            Reject <IoCloseCircle />
                                        </button>
                                    </div>
                                )}

                                {order.status === 'PREPARING' && (
                                    <button
                                        className="action-btn ready"
                                        onClick={() => handleStatusUpdate(order.id, 'READY')}
                                    >
                                        Mark Ready
                                    </button>
                                )}

                                {order.status === 'READY' && (
                                    <button
                                        className="action-btn deliver"
                                        onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                    >
                                        Mark Delivered
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RestaurantOrders;
