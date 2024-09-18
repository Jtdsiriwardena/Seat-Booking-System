import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Intern.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';

const Intern = () => {
    const [interns, setInterns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/interns`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterns(response.data);
            } catch (error) {
                console.error('Error fetching interns:', error.response ? error.response.data : error.message);
            }
        };

        fetchInterns();
    }, [token]);

    const filteredInterns = interns.filter((intern) =>
        `${intern.firstName} ${intern.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="intern-dashboard">
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
                <h1 className="intern-title">Interns</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by first or last name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                {filteredInterns.length > 0 ? (
                    <table className="intern-table">
                        <thead>
                            <tr>
                                <th>Intern ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInterns.map((intern) => (
                                <tr key={intern._id}>
                                    <td>{intern.internID}</td>
                                    <td>{intern.firstName}</td>
                                    <td>{intern.lastName}</td>
                                    <td>{intern.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="intern-no-interns">No interns available</p>
                )}
            </div>
        </div>
    );
};

export default Intern;
