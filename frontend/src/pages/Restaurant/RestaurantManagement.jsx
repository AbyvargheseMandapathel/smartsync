import React, { useState, useEffect } from 'react';
import { IoRestaurant, IoLocation, IoCall } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { getRestaurants, createRestaurant, updateRestaurant, getMe } from '../../api/api';
import './RestaurantManagement.css';

const RestaurantManagement = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone_number: ''
    });

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const [userResponse, restaurantsResponse] = await Promise.all([
                getMe(),
                getRestaurants()
            ]);

            const currentUser = userResponse.data;
            const allRestaurants = restaurantsResponse.data;

            // Find restaurant owned by current user
            const myRestaurant = allRestaurants.find(r => r.owner === currentUser.id);

            if (myRestaurant) {
                setRestaurant(myRestaurant);
                setFormData({
                    name: myRestaurant.name,
                    address: myRestaurant.address,
                    phone_number: myRestaurant.phone_number
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (restaurant) {
                await updateRestaurant(restaurant.id, formData);
                alert('Restaurant updated successfully!');
            } else {
                const response = await createRestaurant(formData);
                setRestaurant(response.data);
                alert('Restaurant created successfully!');
            }
        } catch (error) {
            console.error('Error saving restaurant:', error);
            alert('Failed to save restaurant details.');
        }
    };

    return (
        <DashboardLayout role="RESTAURANT">
            <div className="management-header">
                <h1>Restaurant Profile</h1>
                <p>Manage your restaurant details</p>
            </div>

            <div className="management-content">
                <Card className="profile-form-card">
                    <h2>Create/Update Restaurant</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Restaurant Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            icon={<IoRestaurant />}
                        />
                        <div className="form-group">
                            <label>Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><IoLocation /></span>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="textarea-input-with-icon"
                                    placeholder="Enter full address"
                                />
                            </div>
                        </div>
                        <Input
                            label="Phone Number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            required
                            icon={<IoCall />}
                        />
                        <div className="form-actions">
                            <Button type="submit">
                                Save Details
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default RestaurantManagement;
