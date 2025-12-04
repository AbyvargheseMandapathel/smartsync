import React, { useState, useEffect } from 'react';
import { IoSearch, IoLocationSharp, IoPersonCircle, IoHeart, IoHeartOutline, IoTime, IoRestaurant } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import { getRestaurants, getFavourites, toggleFavourite } from '../../api/api';
import './Dashboard.css';

const UserDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [restaurantsRes, favouritesRes] = await Promise.all([
                getRestaurants(),
                getFavourites()
            ]);
            setRestaurants(restaurantsRes.data);
            // Assuming favouritesRes.data is a list of favourite objects with restaurant field
            setFavourites(favouritesRes.data.map(fav => fav.restaurant));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleToggleFavourite = async (e, restaurantId) => {
        e.stopPropagation();
        try {
            const response = await toggleFavourite(restaurantId);
            if (response.data.status === 'added') {
                setFavourites([...favourites, restaurantId]);
            } else {
                setFavourites(favourites.filter(id => id !== restaurantId));
            }
        } catch (error) {
            console.error('Error toggling favourite:', error);
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => {
        const query = searchQuery.toLowerCase();
        const nameMatch = restaurant.name.toLowerCase().includes(query);
        const menuMatch = restaurant.menu_items.some(item =>
            item.name.toLowerCase().includes(query) ||
            item.ingredients.toLowerCase().includes(query)
        );
        const isFavourite = showFavouritesOnly ? favourites.includes(restaurant.id) : true;
        return (nameMatch || menuMatch) && isFavourite;
    });

    return (
        <DashboardLayout role="USER">
            <div className="app-header">
                <div className="location-selector">
                    <IoLocationSharp className="location-icon" />
                    <div>
                        <span className="location-label">Current Location</span>
                        <span className="location-value">Home <span className="dropdown-arrow">▼</span></span>
                    </div>
                </div>
                <IoPersonCircle className="profile-icon" />
            </div>

            <div className="search-bar-container">
                <div className="search-bar">
                    <IoSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for restaurants or dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="filter-section" style={{ padding: '0 20px', marginBottom: '10px' }}>
                <button
                    className={`filter-btn ${showFavouritesOnly ? 'active' : ''}`}
                    onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
                    style={{
                        background: showFavouritesOnly ? '#ff4757' : '#f1f2f6',
                        color: showFavouritesOnly ? 'white' : '#2f3542',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: '500'
                    }}
                >
                    <IoHeart /> My Favourites
                </button>
            </div>

            {/* Offers section disabled for now */}

            <div className="dashboard-section">
                <h2>Restaurants & Menus</h2>
                {loading ? (
                    <p>Loading restaurants...</p>
                ) : (
                    <div className="restaurants-grid">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurant) => (
                                <Card
                                    key={restaurant.id}
                                    className="restaurant-card-modern"
                                    onClick={() => window.location.href = `/restaurant/${restaurant.id}`}
                                >
                                    <div className="restaurant-image-placeholder">
                                        <div className="placeholder-content">
                                            <span>{restaurant.name[0].toUpperCase()}</span>
                                        </div>
                                        <div className="delivery-time-badge">
                                            <IoTime /> 25 mins
                                        </div>
                                        <button
                                            className="favourite-btn"
                                            onClick={(e) => handleToggleFavourite(e, restaurant.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {favourites.includes(restaurant.id) ? (
                                                <IoHeart color="#ff4757" size={20} />
                                            ) : (
                                                <IoHeartOutline color="#2f3542" size={20} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="restaurant-info">
                                        <h3>{restaurant.name}</h3>
                                        <div className="restaurant-meta">
                                            <span className="rating-badge">★ 4.2</span>
                                            <span className="dot">•</span>
                                            <span>Fast Delivery</span>
                                        </div>

                                        <div className="restaurant-menu-preview">
                                            <h4>Menu</h4>
                                            {restaurant.menu_items && restaurant.menu_items.length > 0 ? (
                                                <div className="menu-items-list">
                                                    {restaurant.menu_items.map((item) => (
                                                        <div key={item.id} className="menu-item-row">
                                                            <div className="menu-item-info">
                                                                <span className={`item-type-dot ${item.veg_or_non_veg === 'VEG' ? 'veg' : 'non-veg'}`}></span>
                                                                <span className="menu-item-name">{item.name}</span>
                                                            </div>
                                                            <span className="menu-item-price">${item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="no-menu">No menu items available.</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p>No restaurants found matching your search.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
