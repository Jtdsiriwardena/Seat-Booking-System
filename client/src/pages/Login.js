import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import backgroundImage from './images/image.png';
import logo from './images/logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            navigate('/Dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
            
                <form onSubmit={handleSubmit}>
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h1 className="heading">Login to Your Account</h1>
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Login</button>
                </form>
                <div className="signup-link">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </div>
            </div>
            <div 
                className="image-container" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
        </div>
    );
};

export default Login;
