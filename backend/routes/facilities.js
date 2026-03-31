const express = require('express');
const router = express.Router();

const Facility = require('../models/Facility');

// GET /api/facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/facilities/:id
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findOne({ id: req.params.id });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(facility);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
