const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sports: {
    type: [String],
    default: [],
  },
});

const facilitySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: null,
    },
    courts: [courtSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);
