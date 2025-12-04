import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import Headerone from '../../components/Header/Headerone';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(formData);
            console.log('Login Success:', response.data);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            navigate('/');
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.detail || 'Invalid username or password.');
            } else {
                setError('Login failed. Please check your connection.');
            }
        }
    };

    return (
        <>
            <Headerone />
            <div className="login-container">
                <div className="login-form-wrapper">
                    <h2>Login to SmartSync</h2>
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="signup-link">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
