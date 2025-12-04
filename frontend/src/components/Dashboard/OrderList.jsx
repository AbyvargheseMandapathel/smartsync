import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import './OrderList.css';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval]}
                {interval === 'minutes' ? ':' : ''}
            </span>
        );
    });

    return (
        <div className="countdown-timer" style={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '0.9em', marginTop: '4px' }}>
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

const OrderList = ({ orders, title = "Recent Orders", onAction, actionLabel, loadingOrderId, onStatusChange }) => {

    const getTargetTime = (order) => {
        if (!order.status || !order.status.toLowerCase().includes("start cooking in")) {
            return null;
        }

        try {
            // Extract minutes from "Start cooking in X minutes"
            const match = order.status.match(/(\d+)\s*minutes?/i);
            if (match && match[1]) {
                const minutes = parseInt(match[1], 10);
                const createdAt = new Date(order.createdAt);
                // Target time is Created At + X minutes
                return new Date(createdAt.getTime() + minutes * 60000);
            }
        } catch (e) {
            console.error("Error parsing time", e);
        }
        return null;
    };

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
                        {orders.map((order) => {
                            const targetTime = getTargetTime(order);

                            return (
                                <tr key={order.id}>
                                    <td className="order-id">#{order.id}</td>
                                    <td className="order-entity">{order.entityName}</td>
                                    <td className="order-items">{order.items} items</td>
                                    <td className="order-total">${order.total}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span
                                                className={`status-badge ${order.status.toLowerCase().split(' ')[0]}`} // Simple class mapping
                                                onClick={() => onStatusChange && onStatusChange(order.id, order.status)}
                                                style={{ cursor: onStatusChange ? 'pointer' : 'default' }}
                                                title={onStatusChange ? "Click to change status" : ""}
                                            >
                                                {order.status.length > 30 ? order.status.substring(0, 27) + '...' : order.status}
                                            </span>
                                            {targetTime && (
                                                <CountdownTimer targetDate={targetTime} />
                                            )}
                                        </div>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default OrderList;
