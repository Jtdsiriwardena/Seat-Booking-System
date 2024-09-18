import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddHoliday.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';

const AddHoliday = () => {
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [filteredHolidays, setFilteredHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchHolidays = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/holidays`);
                const now = new Date();
                const validHolidays = response.data.filter(holiday => new Date(holiday.date) >= now);
                setFilteredHolidays(validHolidays);
            } catch (error) {
                setError('Failed to fetch holidays. Please try again later.');
                console.error('Error fetching holidays:', error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHolidays();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(date) < new Date()) {
            alert('Cannot select a past date for a holiday.');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/holidays`, { date, reason });
            setSuccess('Holiday added successfully!');
            setDate('');
            setReason('');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/holidays`);
            const now = new Date();
            const validHolidays = response.data.filter(holiday => new Date(holiday.date) >= now);
            setFilteredHolidays(validHolidays);
            setError('');
        } catch (error) {
            setError('Failed to add holiday. Please try again.');
            console.error('Error adding holiday:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="add-holiday-container-unique">
            <aside className="add-holiday-sidebar-unique">
                <img src={logo} alt="logo" className="add-holiday-sidebar-logo-unique" />
                <nav className="add-holiday-sidebar-nav-unique"> 
                    <Link to="/Admin">Bookings</Link>
                    <Link to="/Interns">Interns</Link>
                    <Link to="/add-holiday">Add Holiday</Link>
                    <button className="add-holiday-logout-button-unique">Log Out</button>
                </nav>
            </aside>
            <div className="add-holiday-content-unique">
                <h1>Add Holiday</h1>
                <form onSubmit={handleSubmit} className="add-holiday-form-unique">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <label htmlFor="reason">Reason:</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                    <button type="submit" className="add-holiday-submit-button-unique">Add Holiday</button>
                </form>

                {success && <p className="add-holiday-success-message-unique">{success}</p>}
                {error && <p className="add-holiday-error-message-unique">{error}</p>}
                {loading && <p className="add-holiday-loading-message-unique">Loading holidays...</p>}

                <h2>Existing Holidays</h2>
                {filteredHolidays.length > 0 ? (
                    <table className="add-holiday-table-unique">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHolidays.map((holiday) => (
                                <tr key={holiday._id}>
                                    <td>{new Date(holiday.date).toLocaleDateString()}</td>
                                    <td>{holiday.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No holidays found.</p>
                )}
            </div>
        </div>
    );
};

export default AddHoliday;
