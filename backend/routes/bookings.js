const express = require('express');
const router = express.Router();

// In-memory store — replace with a database later
let bookings = [];

// GET /api/bookings
router.get('/', (req, res) => {
  res.json(bookings);
});

// POST /api/bookings
router.post('/', (req, res) => {
  const booking = { id: Date.now().toString(), ...req.body };
  bookings.push(booking);
  res.status(201).json(booking);
});

// DELETE /api/bookings/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings.splice(index, 1);
  res.json({ message: 'Booking cancelled' });
});

module.exports = router;
