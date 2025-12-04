import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = (credentials) => {
    return api.post('auth/jwt/create/', credentials);
};

export const signup = (userData) => {
    return api.post('auth/users/', userData);
};

export const getHomeMessage = () => {
    return api.get('');
};

export const getMe = () => {
    return api.get('auth/users/me/');
};

// Menu API
export const getMenu = () => {
    return api.get('menu/');
};

export const addMenuItem = (itemData) => {
    return api.post('menu/', itemData);
};

export const updateMenuItem = (id, itemData) => {
    return api.patch(`menu/${id}/`, itemData);
};

export const deleteMenuItem = (id) => {
    return api.delete(`menu/${id}/`);
};

export const getRestaurants = () => {
    return api.get('restaurants/');
};

export const createRestaurant = (data) => {
    return api.post('restaurants/', data);
};

export const updateRestaurant = (id, data) => {
    return api.patch(`restaurants/${id}/`, data);
};

export const getRestaurantDetails = (id) => {
    return api.get(`restaurants/${id}/`);
};

export const createOrder = (data) => {
    return api.post('orders/', data);
};

export const getOrders = () => {
    return api.get('orders/');
};

export const updateOrder = (id, data) => {
    return api.patch(`orders/${id}/`, data);
};

export default api;
