const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const toDateOnly = (dateValue) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = String(req.query.userId);
    }

    const bookings = await Booking.find(filter).sort({ date: 1, startHour: 1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  const {
    userId,
    facilityId,
    courtId,
    date,
    startHour,
    endHour,
    sport,
    courtType,
    players,
    teammates,
  } = req.body;

  if (!userId || !facilityId || !courtId || !date || startHour === undefined || endHour === undefined || !sport) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  try {
    const bookingDate = toDateOnly(date);
    if (!bookingDate) {
      return res.status(400).json({ error: 'Invalid booking date' });
    }

    const parsedStart = Number(startHour);
    const parsedEnd = Number(endHour);

    if (!Number.isFinite(parsedStart) || !Number.isFinite(parsedEnd) || parsedStart >= parsedEnd) {
      return res.status(400).json({ error: 'Invalid booking time range' });
    }

    const overlap = await Booking.findOne({
      courtId,
      date: bookingDate,
      status: { $ne: 'cancelled' },
      startHour: { $lt: parsedEnd },
      endHour: { $gt: parsedStart },
    });

    if (overlap) {
      return res.status(409).json({ error: 'Time slot is already booked' });
    }

    const booking = await Booking.create({
      userId: String(userId),
      facilityId,
      courtId,
      date: bookingDate,
      startHour: parsedStart,
      endHour: parsedEnd,
      time: `${String(parsedStart).padStart(2, '0')}:00`,
      duration: parsedEnd - parsedStart,
      sport,
      courtType: courtType || null,
      players: Number.isFinite(Number(players)) ? Number(players) : 1,
      teammates: Array.isArray(teammates) ? teammates : [],
      status: 'upcoming',
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
