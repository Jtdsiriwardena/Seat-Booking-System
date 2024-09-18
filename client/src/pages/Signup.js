import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import backgroundImage from './images/image.png';
import logo from './images/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        internID: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, formData);
            alert('Signup successful!');
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="form-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h1 className="Signup-heading">Create Your Account</h1>
                <form onSubmit={handleSubmit}>
                    <input name="internID" placeholder="Enter your Intern ID" onChange={handleChange} required />
                    <input name="firstName" placeholder="First Name" onChange={handleChange} required />
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Signup</button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </div>
            <div 
                className="image-container" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
        </div>
    );
};

export default Signup;
