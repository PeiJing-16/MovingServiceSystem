const Staff = require('../models/Staff');

const getStaffMembers = async (_req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaffMembers };