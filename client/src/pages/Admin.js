import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const unconfirmed = response.data.filter(booking => !booking.isConfirmed);
                setBookings(unconfirmed);
            } catch (error) {
                console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            }
        };

        const fetchConfirmedBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/confirmed`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConfirmedBookings(response.data);
            } catch (error) {
                console.error('Error fetching confirmed bookings:', error.response ? error.response.data : error.message);
            }
        };

        fetchBookings();
        fetchConfirmedBookings();
    }, [token]);

    const confirmBooking = async (bookingId) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Booking confirmed!');
            const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
            const confirmedBooking = bookings.find(booking => booking._id === bookingId);
            setBookings(updatedBookings);
            setConfirmedBookings([...confirmedBookings, { ...confirmedBooking, isConfirmed: true }]);
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            alert('Failed to confirm booking.');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredBookings = bookings.filter(booking =>
        booking.intern.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.intern.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-dashboard-unique">
            <aside className="sidebar-unique">
                <img src={logo} alt="logo" className="sidebar-logo-unique" />
                <nav className="sidebar-nav-unique">
                    <Link to="/admin" className="sidebar-link-unique">Bookings</Link>
                    <Link to="/interns" className="sidebar-link-unique">Interns</Link>
                    <Link to="/add-holiday" className="sidebar-link-unique">Add Holiday</Link>
                </nav>
                <button className="sidebar-logout-button-unique">Log Out</button>
            </aside>

            <div className="table-content">
                <h1 className="admin-title">Pending Bookings</h1>

                <input
                    type="text"
                    placeholder="Search by First Name or Last Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="admin-search-bar"
                />

                {filteredBookings.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Intern ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Seat Number</th>
                                <th>Special Request</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.intern.internID}</td>
                                    <td>{booking.intern.firstName}</td>
                                    <td>{booking.intern.lastName}</td>
                                    <td>{booking.intern.email}</td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>{booking.seatNumber}</td>
                                    <td>{booking.specialRequest || 'None'}</td>
                                    <td>
                                        <button
                                            className="admin-confirm-button"
                                            onClick={() => confirmBooking(booking._id)}
                                        >
                                            Confirm
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="admin-no-bookings">No unconfirmed bookings available</p>
                )}

                {confirmedBookings.length > 0 && (
                    <>
                        <h2 className="admin-title">Confirmed Bookings</h2>
                        <table className="admin-table confirmed-table">
                            <thead>
                                <tr>
                                    <th>Intern ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Seat Number</th>
                                    <th>Special Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {confirmedBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>{booking.intern.internID}</td>
                                        <td>{booking.intern.firstName}</td>
                                        <td>{booking.intern.lastName}</td>
                                        <td>{booking.intern.email}</td>
                                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                                        <td>{booking.seatNumber}</td>
                                        <td>{booking.specialRequest || 'None'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;
