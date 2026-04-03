const express = require('express');
const { createBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;