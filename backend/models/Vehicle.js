const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {type: String, required: true, enum: ['Ute', 'Truck', 'Van'],},
    capacityKg: {type: Number, required: true},
    regoNumber: {type: String, required: true, maxlength: 7, minlength: 5, unique: true, uppercase: true, trim: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
