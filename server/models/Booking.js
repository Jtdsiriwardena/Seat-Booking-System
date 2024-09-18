
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    date: { type: Date, required: true },
    seatNumber: { type: Number, required: true },
    specialRequest: { type: String }
});

module.exports = mongoose.model('Booking', bookingSchema);
