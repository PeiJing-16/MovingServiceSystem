const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'Unassigned' },
    assignedBookings: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);