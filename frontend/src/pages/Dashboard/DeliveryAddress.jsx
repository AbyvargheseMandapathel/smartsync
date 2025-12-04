import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoLocation, IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { createOrder } from '../../api/api';
import './DeliveryAddress.css';

const DeliveryAddress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { restaurantId, items, totalAmount } = location.state || {};
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    if (!restaurantId || !items) {
        return (
            <DashboardLayout role="USER">
                <div className="error-container">
                    <p>No order details found. Please go back and select items.</p>
                    <Button onClick={() => navigate('/user/dashboard')}>Go Home</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) {
            alert('Please enter a valid address.');
            return;
        }

        setLoading(true);
        try {
            await createOrder({
                restaurant: restaurantId,
                items,
                delivery_address: address
            });
            alert('Order placed successfully!');
            navigate('/user/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            const errorMessage = error.response?.data
                ? JSON.stringify(error.response.data)
                : error.message;
            alert(`Failed to place order: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="USER">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <IoArrowBack /> Back
            </button>

            <div className="address-page-container">
                <div className="address-card">
                    <div className="address-header">
                        <IoLocation className="header-icon" />
                        <h1>Delivery Address</h1>
                        <p>Where should we deliver your food?</p>
                    </div>

                    <form onSubmit={handleConfirmOrder}>
                        <div className="form-group">
                            <label>Full Address</label>
                            <textarea
                                className="address-textarea"
                                placeholder="House No, Street, Landmark, City..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                rows="4"
                            />
                        </div>

                        <div className="order-summary-mini">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Items Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>To Pay</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="confirm-btn">
                            {loading ? 'Placing Order...' : (
                                <>
                                    Confirm Order <IoCheckmarkCircle />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DeliveryAddress;
