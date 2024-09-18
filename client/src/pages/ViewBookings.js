import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBookings.css';
import logo from './images/logo.png';

const ViewBookings = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentDate = new Date();
                
                const upcoming = response.data.filter(booking => new Date(booking.date) >= currentDate);
                const past = response.data.filter(booking => new Date(booking.date) < currentDate);

                setUpcomingBookings(upcoming);
                setPastBookings(past);
            } catch (error) {
                console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            }
        };

        fetchBookings();
    }, [token]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUpcomingBookings(upcomingBookings.filter(booking => booking._id !== bookingId));
        } catch (error) {
            console.error('Error cancelling booking:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="view-bookings-container">
            <header className="dashboard-header">
                <img src={logo} alt="logo" className="dashboard-logo" />
                <nav>
                    <a href="/Dashboard">Book a Seat</a>
                    <a href="/ViewBookings">My Bookings</a>
                </nav>
                <button className="logout-button">Log Out</button>
            </header>

            <h1>Your Bookings</h1>

            <h2>Upcoming Bookings</h2>
            {upcomingBookings.length > 0 ? (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Seat Number</th>
                            <th>Special Request</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                <td>{booking.seatNumber}</td>
                                <td>{booking.specialRequest || 'None'}</td>
                                <td>
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelBooking(booking._id)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No upcoming bookings available</p>
            )}

            <h2>Past Bookings</h2>
            {pastBookings.length > 0 ? (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Seat Number</th>
                            <th>Special Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                <td>{booking.seatNumber}</td>
                                <td>{booking.specialRequest || 'None'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No past bookings available</p>
            )}
        </div>
    );
};

export default ViewBookings;
