import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoPerson, IoLockClosed, IoLogoGoogle, IoLogoFacebook } from 'react-icons/io5';
import Headerone from '../../components/Header/Headerone';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import { login, getMe } from '../../api/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData);
            const { access, refresh } = response.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Fetch user profile to get role
            const userResponse = await getMe();
            const userType = userResponse.data.user_type;

            if (userType === 'RESTAURANT') {
                navigate('/restaurant/dashboard');
            } else {
                navigate('/user/dashboard');
            }

            setLoading(false);
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <>
            <Headerone />
            <AnimatedBackground variant="gradient" />

            <div className="login-page">
                <div className="login-container-modern">
                    {/* Left Side - Form */}
                    <motion.div
                        className="login-form-section"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card padding="large" className="login-card">
                            <div className="login-header">
                                <h1 className="login-title">Welcome Back!</h1>
                                <p className="login-subtitle">
                                    Sign in to continue to SmartSync
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form">
                                <Input
                                    label="Username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    icon={<IoPerson />}
                                    required
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    icon={<IoLockClosed />}
                                    required
                                />

                                <div className="form-extras">
                                    <label className="remember-me">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="forgot-link">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="large"
                                    fullWidth
                                    loading={loading}
                                >
                                    Sign In
                                </Button>
                            </form>

                            <div className="divider">
                                <span>OR CONTINUE WITH</span>
                            </div>

                            <div className="social-login">
                                <Button
                                    variant="outline"
                                    icon={<IoLogoGoogle />}
                                    className="social-btn"
                                >
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    icon={<IoLogoFacebook />}
                                    className="social-btn"
                                >
                                    Facebook
                                </Button>
                            </div>

                            <p className="signup-prompt">
                                Don't have an account?{' '}
                                <Link to="/signup" className="signup-link-text">
                                    Sign up now
                                </Link>
                            </p>
                        </Card>
                    </motion.div>

                    {/* Right Side - Illustration */}
                    <motion.div
                        className="login-illustration-section"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="illustration-content">
                            <motion.div
                                className="floating-emoji"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🍕
                            </motion.div>
                            <motion.div
                                className="floating-emoji"
                                style={{ top: '30%', right: '20%' }}
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🍔
                            </motion.div>
                            <motion.div
                                className="floating-emoji"
                                style={{ bottom: '20%', left: '15%' }}
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                🍜
                            </motion.div>

                            <div className="illustration-text">
                                <h2>Order Your Favorite Food</h2>
                                <p>Join thousands of food lovers and restaurants on SmartSync</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Login;
