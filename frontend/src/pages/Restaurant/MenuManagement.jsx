import React, { useState, useEffect } from 'react';
import { IoAdd, IoPencil, IoTrash, IoTime, IoLeaf, IoFastFood } from 'react-icons/io5';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../../api/api';
import './MenuManagement.css';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ingredients: '',
        veg_or_non_veg: 'VEG',
        preparation_time: '',
        price: '',
        is_available: true
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await getMenu();
            setMenuItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateMenuItem(editingItem.id, formData);
                alert('Menu item updated successfully!');
            } else {
                await addMenuItem(formData);
                alert('Menu item added successfully!');
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({
                name: '',
                ingredients: '',
                veg_or_non_veg: 'VEG',
                preparation_time: '',
                price: '',
                is_available: true
            });
            fetchMenu();
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert('Failed to save menu item.');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            ingredients: item.ingredients,
            veg_or_non_veg: item.veg_or_non_veg,
            preparation_time: item.preparation_time,
            price: item.price,
            is_available: item.is_available
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteMenuItem(id);
                fetchMenu();
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert('Failed to delete menu item.');
            }
        }
    };

    return (
        <DashboardLayout role="RESTAURANT">
            <div className="menu-header">
                <div>
                    <h1>Menu Management</h1>
                    <p>Manage your restaurant's menu items</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            name: '',
                            ingredients: '',
                            veg_or_non_veg: 'VEG',
                            preparation_time: '',
                            price: '',
                            is_available: true
                        });
                        setShowForm(true);
                    }}
                    icon={<IoAdd />}
                >
                    Add New Item
                </Button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <Card className="menu-form-card">
                        <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Item Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="form-group">
                                <label>Description/Ingredients</label>
                                <textarea
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleInputChange}
                                    required
                                    className="textarea-input"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        name="veg_or_non_veg"
                                        value={formData.veg_or_non_veg}
                                        onChange={handleInputChange}
                                        className="select-input"
                                    >
                                        <option value="VEG">Veg</option>
                                        <option value="NON_VEG">Non-Veg</option>
                                    </select>
                                </div>
                                <Input
                                    label="Prep Time (mins)"
                                    type="number"
                                    name="preparation_time"
                                    value={formData.preparation_time}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    label="Price ($)"
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={formData.is_available}
                                        onChange={handleInputChange}
                                    />
                                    Available for ordering
                                </label>
                            </div>
                            <div className="form-actions">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <div className="menu-grid">
                {menuItems.map((item) => (
                    <Card key={item.id} className="menu-item-card">
                        <div className="menu-item-header">
                            <span className={`item-type ${item.veg_or_non_veg === 'VEG' ? 'veg' : 'non-veg'}`}>
                                {item.veg_or_non_veg === 'VEG' ? <IoLeaf /> : <IoFastFood />}
                            </span>
                            <div className="item-actions">
                                <button onClick={() => handleEdit(item)} className="icon-btn edit">
                                    <IoPencil />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="icon-btn delete">
                                    <IoTrash />
                                </button>
                            </div>
                        </div>
                        <h3>{item.name}</h3>
                        <p className="item-ingredients">{item.ingredients}</p>
                        <div className="item-details">
                            <span className="item-time">
                                <IoTime /> {item.preparation_time} mins
                            </span>
                            <span className="item-price">${item.price}</span>
                        </div>
                        {!item.is_available && (
                            <div className="item-unavailable">Currently Unavailable</div>
                        )}
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default MenuManagement;
