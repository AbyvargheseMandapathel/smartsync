import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoRestaurant, IoTrash } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import { getFavorites, deleteFavorite } from '../../api/api';
import './UserFavorites.css';

const UserFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await getFavorites();
            setFavorites(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Remove from favorites?')) {
            try {
                await deleteFavorite(id);
                setFavorites(favorites.filter(fav => fav.id !== id));
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
        }
    };

    return (
        <DashboardLayout role="USER">
            <div className="favorites-header">
                <h1>My Favorites</h1>
                <p>Your favorite restaurants</p>
            </div>

            <div className="favorites-grid">
                {loading ? (
                    <p>Loading favorites...</p>
                ) : favorites.length > 0 ? (
                    favorites.map(fav => (
                        <Card 
                            key={fav.id} 
                            className="favorite-card"
                            onClick={() => navigate(`/restaurant/${fav.restaurant}`)}
                        >
                            <div className="favorite-image-placeholder">
                                <IoRestaurant />
                            </div>
                            <div className="favorite-info">
                                <h3>{fav.restaurant_name}</h3>
                                <p>Restaurant</p>
                            </div>
                            <button 
                                className="remove-fav-btn" 
                                onClick={(e) => handleRemoveFavorite(fav.id, e)}
                                title="Remove from favorites"
                            >
                                <IoHeart className="heart-icon filled" />
                            </button>
                        </Card>
                    ))
                ) : (
                    <div className="no-favorites">
                        <IoHeart className="no-fav-icon" />
                        <h3>No favorites yet</h3>
                        <p>Mark restaurants as favorites to see them here!</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserFavorites;
