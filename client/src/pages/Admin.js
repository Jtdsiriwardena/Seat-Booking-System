import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faPlusCircle, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                
                const sortedBookings = response.data.sort((a, b) => {
                    return a.isConfirmed === b.isConfirmed ? 0 : a.isConfirmed ? 1 : -1;
                });

                setBookings(sortedBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            }
        };

        fetchBookings();
    }, [token]);

    const confirmBooking = async (bookingId) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Booking confirmed!');

            const updatedBookings = bookings.map(booking =>
                booking._id === bookingId ? { ...booking, isConfirmed: true } : booking
            );

       
            const sortedUpdatedBookings = updatedBookings.sort((a, b) => {
                return a.isConfirmed === b.isConfirmed ? 0 : a.isConfirmed ? 1 : -1;
            });

            setBookings(sortedUpdatedBookings);
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            alert('Failed to confirm booking.');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredBookings = bookings.filter(booking =>
        booking.intern &&
        (booking.intern.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.intern.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredBookings.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <aside className="ad-sidebar-unique">
                <img src={logo} alt="logo" className="ad-sidebar-logo-unique" />
                <nav className="ad-sidebar-nav-unique">
                    <Link to="/admin"  className={`px-4 py-2 rounded-tr-full rounded-br-full transition-colors duration-200 ${window.location.pathname === '/admin' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600 hover:text-white'}`}>
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Bookings
                    </Link>
                    <Link to="/interns" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faUser} className="ad-sidebar-icon" />
                        Interns
                    </Link>
                    <Link to="/add-holiday" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faPlusCircle} className="ad-sidebar-icon" />
                        Add Holiday
                    </Link>
                    <Link to="/attendance" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faCalendar} className="ad-sidebar-icon" />
                        Daily Attendance
                    </Link>
                    <Link to="/intern-attendance" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Intern Attendance
                    </Link>
                </nav>
                <button className="ad-sidebar-logout-button-unique">
                    <FontAwesomeIcon icon={faSignOutAlt} className="ad-sidebar-icon" />
                    Log Out
                </button>
            </aside>

            <div className="table-content p-6">
                <h1 className="text-2xl font-bold mb-4">Bookings</h1>

                <input
                    type="text"
                    placeholder="Search by First Name or Last Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="p-2 mb-4 border rounded w-full"
                />

                {currentRows.length > 0 ? (
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="px-4 py-2">Intern ID</th>
                                <th className="px-4 py-2">First Name</th>
                                <th className="px-4 py-2">Last Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Seat Number</th>
                                <th className="px-4 py-2">Special Request</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{booking.intern ? booking.intern.internID : 'N/A'}</td>
                                    <td className="border px-4 py-2">{booking.intern ? booking.intern.firstName : 'N/A'}</td>
                                    <td className="border px-4 py-2">{booking.intern ? booking.intern.lastName : 'N/A'}</td>
                                    <td className="border px-4 py-2">{booking.intern ? booking.intern.email : 'N/A'}</td>
                                    <td className="border px-4 py-2">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">{booking.seatNumber}</td>
                                    <td className="border px-4 py-2">{booking.specialRequest || 'None'}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className={`py-1 px-3 rounded ${booking.isConfirmed ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'} hover:opacity-90`}
                                            onClick={() => confirmBooking(booking._id)}
                                            disabled={booking.isConfirmed}
                                        >
                                            {booking.isConfirmed ? 'Confirmed' : 'Confirm'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500">No bookings available</p>
                )}

                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(filteredBookings.length / rowsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
