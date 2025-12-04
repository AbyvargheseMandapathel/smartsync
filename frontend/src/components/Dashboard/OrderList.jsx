import React from 'react';
import Card from '../UI/Card';
import './OrderList.css';

const OrderList = ({ orders, title = "Recent Orders", onAction, actionLabel, loadingOrderId, onStatusChange }) => {
    return (
        <Card className="order-list-card">
            <div className="order-list-header">
                <h3>{title}</h3>
                <button className="view-all-btn">View All</button>
            </div>
            <div className="order-list-content">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer/Restaurant</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            {onAction && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="order-id">#{order.id}</td>
                                <td className="order-entity">{order.entityName}</td>
                                <td className="order-items">{order.items} items</td>
                                <td className="order-total">${order.total}</td>
                                <td>
                                    <span
                                        className={`status-badge ${order.status.toLowerCase()}`}
                                        onClick={() => onStatusChange && onStatusChange(order.id, order.status)}
                                        style={{ cursor: onStatusChange ? 'pointer' : 'default' }}
                                        title={onStatusChange ? "Click to change status" : ""}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="order-date">{order.date}</td>
                                {onAction && (
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => onAction(order.id)}
                                            disabled={loadingOrderId === order.id}
                                            style={{ opacity: loadingOrderId === order.id ? 0.7 : 1, cursor: loadingOrderId === order.id ? 'not-allowed' : 'pointer' }}
                                        >
                                            {loadingOrderId === order.id ? 'Loading...' : (actionLabel || 'Action')}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default OrderList;
