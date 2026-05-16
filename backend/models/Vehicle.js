const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
      enum: ['Ute', 'Truck', 'Van'],
    },
    capacityKg: {
      type: Number,
      required: true,
      min: 1,
    },
    regoNumber: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 7,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Encapsulation example
vehicleSchema.methods.getVehicleDisplayName = function () {
  return `${this.vehicleType} - ${this.regoNumber} (${this.capacityKg}kg)`;
};

// Encapsulation example
vehicleSchema.methods.canCarry = function (requiredKg) {
  return this.capacityKg >= requiredKg;
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
