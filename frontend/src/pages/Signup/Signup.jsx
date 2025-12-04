import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/api';
import Headerone from '../../components/Header/Headerone';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {
            // Djoser expects re_password instead of confirmPassword
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                re_password: formData.confirmPassword
            };

            const response = await signup(payload);
            console.log('Signup Success:', response.data);
            // Redirect to login after successful signup
            navigate('/login');
        } catch (err) {
            console.error('Signup Error:', err);
            if (err.response && err.response.data) {
                // Display first error message found
                const errorData = err.response.data;
                let errorMessage = 'Signup failed. Please try again.';

                // Check for specific field errors
                if (errorData.username) errorMessage = `Username: ${errorData.username[0]}`;
                else if (errorData.email) errorMessage = `Email: ${errorData.email[0]}`;
                else if (errorData.password) errorMessage = `Password: ${errorData.password[0]}`;
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];
                else {
                    // Fallback to first available error
                    const firstError = Object.values(errorData)[0];
                    if (Array.isArray(firstError)) errorMessage = firstError[0];
                    else if (typeof firstError === 'string') errorMessage = firstError;
                }
                setError(errorMessage);
            } else {
                setError('Signup failed. Please check your connection.');
            }
        }
    };

    return (
        <>
            <Headerone />
            <div className="signup-container">
                <div className="signup-form-wrapper">
                    <h2>Create an Account</h2>
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
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">Sign Up</button>
                    </form>
                    <p className="login-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
