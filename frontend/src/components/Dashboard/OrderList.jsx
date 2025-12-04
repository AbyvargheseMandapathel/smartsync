import React from 'react';
import Card from '../UI/Card';
import './OrderList.css';

const OrderList = ({ orders, title = "Recent Orders" }) => {
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
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="order-date">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default OrderList;
