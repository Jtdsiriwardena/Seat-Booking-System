const express = require('express');
const { bookSeat, getBookings, confirmBooking } = require('../controllers/bookingController');
const { getAllBookings } = require('../controllers/bookingController');
const { cancelBooking } = require('../controllers/bookingController');
const bookingController = require('../controllers/bookingController');
const { getConfirmedBookings } = require('../controllers/bookingController');

const { getInternAttendance } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', bookSeat);


router.get('/', getBookings);


router.get('/all', getAllBookings);


router.get('/all', bookingController.getAllBookings);

router.get('/confirmed', getConfirmedBookings);


router.put('/:bookingId/confirm', confirmBooking);


router.delete('/:bookingId', cancelBooking);



router.put('/:bookingId/attendance', bookingController.updateAttendance);

router.get('/intern/:internId', getInternAttendance);

router.post('/book-seat', bookingController.bookSeat);




module.exports = router;
