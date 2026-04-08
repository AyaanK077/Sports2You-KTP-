const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');

// GET /api/facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find({}).sort({ name: 1 });
    return res.json(facilities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load facilities' });
  }
});

// GET /api/facilities/:id
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findOne({ id: req.params.id });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    return res.json(facility);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load facility' });
  }
});

module.exports = router;
