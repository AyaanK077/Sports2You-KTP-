const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    facilityId: {
      type: String,
      required: true,
    },
    courtId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 1,
    },
    startHour: {
      type: Number,
      required: true,
    },
    endHour: {
      type: Number,
      required: true,
    },
    sport: {
      type: String,
      required: true,
    },
    courtType: {
      type: String,
      default: null,
    },
    players: {
      type: Number,
      default: 1,
    },
    teammates: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
