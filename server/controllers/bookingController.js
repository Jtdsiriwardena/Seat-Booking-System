const Booking = require('../models/Booking');
const Intern = require('../models/Intern');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../services/emailService'); 

async function sendConfirmationEmail(internEmail) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: internEmail,
        subject: 'Seat Booking Confirmation',
        text: 'Your booking has been confirmed!',
    };

    await transporter.sendMail(mailOptions);
}


exports.bookSeat = async (req, res) => {
    console.log('Intern ID from middleware:', req.internId); 
    const { date, seatNumber, specialRequest } = req.body;
    
    try {
        const existingBooking = await Booking.findOne({ date, seatNumber });
        if (existingBooking) {
            return res.status(400).json({ message: 'Seat already booked for this date.' });
        }


        const booking = new Booking({ intern: req.internId, date, seatNumber, specialRequest });
        await booking.save();

        const intern = await Intern.findById(req.internId);
        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }

        await sendConfirmationEmail(intern.email);
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error booking seat:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ intern: req.internId }).populate('intern');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {

        const allBookings = await Booking.find().populate('intern', 'internID firstName lastName email');
        res.json(allBookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const ConfirmBooking = require('../models/confirmBooking');

exports.confirmBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId).populate('intern');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const confirmedBooking = new ConfirmBooking({
            intern: booking.intern._id,
            date: booking.date,
            seatNumber: booking.seatNumber,
            specialRequest: booking.specialRequest,
        });

        await confirmedBooking.save();

        if (booking.intern && booking.intern.email) {
            await sendEmail(
                booking.intern.email,
                booking.intern.firstName,
                booking.intern.lastName,
                booking.date,
                booking.seatNumber,
                booking.specialRequest
            );
        } else {
            return res.status(404).json({ message: 'Intern email not found' });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.json({ message: 'Booking confirmed and transferred to ConfirmBookings' });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getConfirmedBookings = async (req, res) => {
    try {
        const confirmedBookings = await ConfirmBooking.find().populate('intern', 'internID firstName lastName email');
        res.json(confirmedBookings);
    } catch (error) {
        console.error('Error fetching confirmed bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



