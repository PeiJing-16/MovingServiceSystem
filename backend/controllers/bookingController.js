const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user.id });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.serviceType = req.body.serviceType ?? booking.serviceType;
    booking.propertyType = req.body.propertyType ?? booking.propertyType;
    booking.pickupAddress = req.body.pickupAddress ?? booking.pickupAddress;
    booking.destinationAddress = req.body.destinationAddress ?? booking.destinationAddress;
    booking.date = req.body.date ?? booking.date;
    booking.time = req.body.time ?? booking.time;
    booking.remarks = req.body.remarks ?? booking.remarks;
    booking.assignedStaff = req.body.assignedStaff ?? booking.assignedStaff;
    booking.status = req.body.status ?? booking.status;

    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookingsAdmin = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('assignedStaff', 'name role phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.assignedStaff = req.body.assignedStaff ?? booking.assignedStaff;
    booking.status = req.body.status ?? booking.status;
    booking.remarks = req.body.remarks ?? booking.remarks;

    const updated = await booking.save();
    const populated = await updated.populate('assignedStaff', 'name role phone');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {  createBooking,  getBookings,  updateBooking,  deleteBooking,  getAllBookingsAdmin,  adminUpdateBooking};
