const express = require('express');
const router = express.Router();

const facilities = [
  {
    id: 'ac',
    name: 'Activity Center',
    courts: [
      { id: 'ac-main-left', name: 'Main Gym Left', sports: ['basketball'] },
      { id: 'ac-main-mid', name: 'Main Gym Middle', sports: ['basketball'] },
      { id: 'ac-main-right', name: 'Main Gym Right', sports: ['basketball'] },
      { id: 'ac-side', name: 'Side Gym', sports: ['basketball', 'soccer'] },
    ],
  },
  {
    id: 'rec',
    name: 'Recreation Center West',
    courts: [
      { id: 'rec-main', name: 'Main Court', sports: ['basketball', 'soccer'] },
    ],
  },
];

// GET /api/facilities
router.get('/', (req, res) => {
  res.json(facilities);
});

// GET /api/facilities/:id
router.get('/:id', (req, res) => {
  const facility = facilities.find((f) => f.id === req.params.id);
  if (!facility) {
    return res.status(404).json({ error: 'Facility not found' });
  }
  res.json(facility);
});

module.exports = router;
