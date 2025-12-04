import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMail, IoLockClosed, IoPerson, IoLogoGoogle, IoLogoFacebook } from 'react-icons/io5';
import Headerone from '../../components/Header/Headerone';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import { signup } from '../../api/api';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setLoading(true);

        try {
            await signup({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                re_password: formData.confirmPassword
            });

            alert('Account created successfully! Please log in.');
            navigate('/login');
            setLoading(false);
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                const errorMsg = Object.values(error.response.data).flat().join('\n');
                alert(`Signup failed:\n${errorMsg}`);
            } else {
                alert('Signup failed. Please try again.');
            }
            setLoading(false);
        }
    };

    return (
        <>
            <Headerone />
            <AnimatedBackground variant="gradient" />

            <div className="signup-page">
                <div className="signup-container-modern">
                    <Card padding="large" className="signup-card">
                        <div className="signup-header">
                            <h1 className="signup-title">Create Account</h1>
                            <p className="signup-subtitle">
                                Join SmartSync and start ordering delicious food
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="signup-form">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="form-fields"
                            >
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
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<IoMail />}
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
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    icon={<IoLockClosed />}
                                    required
                                />
                            </motion.div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                fullWidth
                                loading={loading}
                            >
                                Create Account
                            </Button>

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
                        </form>

                        <p className="login-prompt">
                            Already have an account?{' '}
                            <Link to="/login" className="login-link-text">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Signup;