import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (credentials) => {
    return api.post('auth/jwt/create/', credentials);
};

export const signup = (userData) => {
    return api.post('auth/users/', userData);
};

export const getHomeMessage = () => {
    return api.get('');
};

export default api;
