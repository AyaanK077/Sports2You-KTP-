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
    short: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    hours: {
      type: Map,
      of: String,
      default: {},
    },
    openHour: {
      type: Map,
      of: Number,
      default: {},
    },
    closeHour: {
      type: Map,
      of: Number,
      default: {},
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
