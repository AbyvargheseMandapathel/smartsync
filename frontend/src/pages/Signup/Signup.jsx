import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMail, IoLockClosed, IoPerson, IoLogoGoogle, IoLogoFacebook } from 'react-icons/io5';
import Headerone from '../../components/Header/Headerone';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
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
            // TODO: Replace with actual API call to backend
            // const response = await fetch('http://127.0.0.1:8000/api/signup', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ 
            //     ...formData, 
            //     role: 'user' // Default role for all new signups
            //   })
            // });
            // const data = await response.json();

            setTimeout(() => {
                console.log('Signup Data:', { ...formData, role: 'user' });
                // Redirect to login after successful signup
                navigate('/login');
                setLoading(false);
            }, 2000);
        } catch (error) {
            console.error('Signup error:', error);
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
