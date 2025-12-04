import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoTime, IoStar, IoCart } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import { getRestaurantDetails, createOrder } from '../../api/api';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState({}); // { menuItemId: { item, quantity } }

    useEffect(() => {
        fetchRestaurantDetails();
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            const response = await getRestaurantDetails(id);
            setRestaurant(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            setLoading(false);
        }
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev[item.id];
            const quantity = existing ? existing.quantity + 1 : 1;
            return { ...prev, [item.id]: { item, quantity } };
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const existing = prev[itemId];
            if (!existing) return prev;
            if (existing.quantity > 1) {
                return { ...prev, [itemId]: { ...existing, quantity: existing.quantity - 1 } };
            } else {
                const newCart = { ...prev };
                delete newCart[itemId];
                return newCart;
            }
        });
    };

    const calculateTotal = () => {
        return Object.values(cart).reduce((total, { item, quantity }) => total + (parseFloat(item.price) * quantity), 0);
    };

    const [address, setAddress] = useState('');

    const handlePlaceOrder = () => {
        const items = Object.values(cart).map(({ item, quantity }) => ({
            menu_item: item.id,
            quantity
        }));

        if (items.length === 0) return;

        navigate('/user/checkout', {
            state: {
                restaurantId: restaurant.id,
                items,
                totalAmount
            }
        });
    };

    if (loading) return <p>Loading...</p>;
    if (!restaurant) return <p>Restaurant not found.</p>;

    const totalAmount = calculateTotal();
    const cartItemCount = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0);

    return (
        <DashboardLayout role="USER">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <IoArrowBack /> Back
            </button>

            <div className="restaurant-banner">
                <div className="restaurant-details-header">
                    <h1>{restaurant.name}</h1>
                    <div className="meta-info">
                        <span className="rating"><IoStar /> 4.5</span>
                        <span className="time"><IoTime /> 30-40 mins</span>
                        <span className="address">{restaurant.address}</span>
                    </div>
                </div>
            </div>

            <div className="menu-section">
                <h2>Menu</h2>
                <div className="menu-list">
                    {restaurant.menu_items.map(item => (
                        <div key={item.id} className="menu-item-card">
                            <div className="item-info">
                                <span className={`type-indicator ${item.veg_or_non_veg === 'VEG' ? 'veg' : 'non-veg'}`}></span>
                                <h3>{item.name}</h3>
                                <p className="price">₹{item.price}</p>
                                <p className="description">{item.ingredients}</p>
                            </div>
                            <div className="item-action">
                                {cart[item.id] ? (
                                    <div className="quantity-control">
                                        <button onClick={() => removeFromCart(item.id)}>-</button>
                                        <span>{cart[item.id].quantity}</span>
                                        <button onClick={() => addToCart(item)}>+</button>
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={() => addToCart(item)}>ADD</Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {cartItemCount > 0 && (
                <div className="cart-floating-bar-container">
                    <div className="address-input-container">
                        <input
                            type="text"
                            placeholder="Enter delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="address-input"
                        />
                    </div>
                    <div className="cart-floating-bar">
                        <div className="cart-summary">
                            <span className="item-count">{cartItemCount} Items</span>
                            <span className="total-price">₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <button className="place-order-btn" onClick={handlePlaceOrder}>
                            Place Order <IoCart />
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default RestaurantDetails;
