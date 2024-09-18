import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import logo from './images/logo.png';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [date, setDate] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const [userSeat, setUserSeat] = useState(null);
    const token = localStorage.getItem('token');
    const internId = localStorage.getItem('internId');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
                console.log('All bookings fetched:', response.data);

                const userBooking = response.data.find(booking => 
                    booking.internId === internId && 
                    new Date(booking.date).toDateString() === new Date(date).toDateString()
                );
                setUserSeat(userBooking ? userBooking.seatNumber : null);
            } catch (error) {
                console.error('Error fetching all bookings:', error.response ? error.response.data : error.message);
            }
        };

        const fetchHolidays = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/holidays`);
                setHolidays(response.data);
                console.log('Holidays fetched:', response.data);
            } catch (error) {
                console.error('Error fetching holidays:', error.response ? error.response.data : error.message);
            }
        };

        if (date) {
            fetchBookings();
        }
        fetchHolidays();
    }, [date, token, internId]);

    const handleBooking = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
                internId,
                date,
                seatNumber,
                specialRequest
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Booking successful:', response);
            setUserSeat(seatNumber);
            alert('Booking successful!');
        } catch (error) {
            console.error('Error booking seat:', error.response ? error.response.data : error.message);
            alert('Error booking seat!');
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const dayOfWeek = new Date(selectedDate).getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            alert('Booking is not allowed on weekends.');
            setDate('');
        } else {
            setDate(selectedDate);
        }
    };

    const getSeatColor = (seat) => {
        if (!date) return 'available';

        const isBooked = bookings.some(booking => 
            booking.seatNumber === seat && 
            new Date(booking.date).toDateString() === new Date(date).toDateString()
        );

        const isHoliday = holidays.some(holiday => 
            new Date(holiday.date).toDateString() === new Date(date).toDateString()
        );

        if (isHoliday) return 'holiday';
        if (isBooked) return 'booked';
        if (seat === userSeat) return 'selected';
        return 'available';
    };

    const handleSeatClick = (seat) => {
        const color = getSeatColor(seat);
        if (color === 'holiday') {
            const holiday = holidays.find(h => 
                new Date(h.date).toDateString() === new Date(date).toDateString()
            );
            if (holiday) {
                alert(`Holiday Reason: ${holiday.reason}`);
            }
        } else if (color !== 'booked') {
            setSeatNumber(seat);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src={logo} alt="logo" className="dashboard-logo" />
                <nav>
                    <a href="/Dashboard">Book a Seat</a>
                    <a href="/ViewBookings">My Bookings</a>
                </nav>
                <button className="logout-button">Log Out</button>
            </header>

            <div className="dashboard-content">
                <div className="seat-selection">
                    <h4>Select a Seat for Booking</h4>
                    <form onSubmit={handleBooking}>
                        <div className="form-group">
                            <label htmlFor="date">Select the date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={handleDateChange}
                                required
                            />
                            <div className="legend">
                                <span className="legend-item booked">Booked Seats</span>
                                <span className="legend-item available">Available Seats</span>
                                <span className="legend-item holiday">Holidays</span>
                            </div>
                        </div>
                        <div className="seat-grid">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(seat => (
                                <div
                                    key={seat}
                                    className={`seat ${getSeatColor(seat)}`}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    {seat}
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="confirm-button">Confirm Booking</button>
                    </form>
                </div>

                <div className="special-request">
                    <h4>Make a Special Request</h4>
                    <textarea
                        placeholder="If you have any special requests or requirements for your seating arrangement, please specify them in the box below:"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
