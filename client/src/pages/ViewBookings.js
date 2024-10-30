import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBookings.css';
import logo from './images/logo.png';

const ViewBookings = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [activeTable, setActiveTable] = useState('upcoming');

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
             <header className="dashboard-header flex items-center justify-between mb-6">
                <img src={logo} alt="logo" className="dashboard-logo h-13" />
                <nav className="flex space-x-4">
                    <a 
                        href="/Dashboard" 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${window.location.pathname === '/Dashboard' ? 'bg-blue-800 text-white' : 'hover:bg-blue-400 hover:text-white'}`}
                    >
                        Book a Seat
                    </a>
                    <a 
                        href="/ViewBookings" 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${window.location.pathname === '/ViewBookings' ? 'bg-slate-600 text-white' : 'hover:bg-blue-400 hover:text-white'}`}
                    >
                        My Bookings
                    </a>
                </nav>
                <button className="logout-button bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500">Log Out</button>
            </header>

        
            <div className="table-navigation">
                <button
                    className={`nav-button ${activeTable === 'upcoming' ? 'active' : ''} bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500`}
                    onClick={() => setActiveTable('upcoming')}
                >
                    Upcoming Bookings
                </button>
                <button
                    className={`nav-button ${activeTable === 'past' ? 'active' : ''} bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500`}
                    onClick={() => setActiveTable('past')}
                >
                    Past Bookings
                </button>
            </div>

           
            {activeTable === 'upcoming' && (
                <>
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
                </>
            )}

          
            {activeTable === 'past' && (
                <>
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
                </>
            )}
        </div>
    );
};

export default ViewBookings;
