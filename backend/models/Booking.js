const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true },
    propertyType: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    remarks: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);