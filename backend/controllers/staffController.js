const Staff = require('../models/Staff');

const getStaffMembers = async (_req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStaffMember = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    staff.name = req.body.name ?? staff.name;
    staff.role = req.body.role ?? staff.role;
    staff.phone = req.body.phone ?? staff.phone;
    staff.status = req.body.status ?? staff.status;
    staff.assignedBookings =
      req.body.assignedBookings ?? staff.assignedBookings;

    const updated = await staff.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaffMembers,  createStaffMember,  updateStaffMember,  deleteStaffMember,};