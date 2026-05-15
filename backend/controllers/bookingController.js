const Booking = require('../models/Booking');
const BookingStatusContext = require('../services/BookingStatusStrategy')

const normalizeAssignedStaff = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value ? [value] : [];
  }

  return [];
};

const normalizeStringArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeObjectIdArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value ? [value] : [];
  }

  return [];
};

const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user.id,
      inventoryItems: normalizeObjectIdArray(req.body.inventoryItems),
      customItems: normalizeStringArray(req.body.customItems),
    };

    const booking = await Booking.create(bookingData);

    const populatedBooking = await Booking.findById(booking._id).populate(
      'inventoryItems',
      'itemName category isActive'
    );

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('inventoryItems', 'itemName category isActive')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // controller asks the BookingStatusContext to know the current booking status is that able to update
    const statusContext = new BookingStatusContext(booking.status);

    if (!statusContext.canUserUpdate()) {
      return res.status(400).json({
        message: "Only pending bookings can be updated.",
      });
    }

    booking.serviceType = req.body.serviceType ?? booking.serviceType;
    booking.propertyType = req.body.propertyType ?? booking.propertyType;
    booking.pickupAddress = req.body.pickupAddress ?? booking.pickupAddress;
    booking.destinationAddress =
      req.body.destinationAddress ?? booking.destinationAddress;
    booking.date = req.body.date ?? booking.date;
    booking.time = req.body.time ?? booking.time;
    booking.remarks = req.body.remarks ?? booking.remarks;

    if (req.body.inventoryItems !== undefined) {
      booking.inventoryItems = normalizeObjectIdArray(req.body.inventoryItems);
    }

    if (req.body.customItems !== undefined) {
      booking.customItems = normalizeStringArray(req.body.customItems);
    }

    const updated = await booking.save();

    const populated = await Booking.findById(updated._id).populate(
      'inventoryItems',
      'itemName category isActive'
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // controller asks the BookingStatusContext to know the current booking status is that able to delete
    const statusContext = new BookingStatusContext(booking.status);

    if (!statusContext.canUserCancel()) {
      return res.status(400).json({
        message: "Only pending bookings can be canceled.",
      });
    }

    await booking.deleteOne();

    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookingsAdmin = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('assignedStaff', 'name role phone')
      .populate('inventoryItems', 'itemName category isActive')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const normalizedAssignedStaff = normalizeAssignedStaff(req.body.assignedStaff);

    if (normalizedAssignedStaff !== undefined) {
      booking.assignedStaff = normalizedAssignedStaff;
    }

    booking.status = req.body.status ?? booking.status;
    booking.remarks = req.body.remarks ?? booking.remarks;

    const updated = await booking.save();

    const populated = await Booking.findById(updated._id)
      .populate('user', 'name email phone')
      .populate('assignedStaff', 'name role phone')
      .populate('inventoryItems', 'itemName category isActive');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  getAllBookingsAdmin,
  adminUpdateBooking,
};