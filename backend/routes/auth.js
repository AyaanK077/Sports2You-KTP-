const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Placeholder — real auth logic goes here
  res.json({
    message: 'Login successful',
    user: { id: '1', email, name: email.split('@')[0] },
    token: 'placeholder-token',
  });
});

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Placeholder — real registration logic goes here
  res.status(201).json({
    message: 'Account created',
    user: { id: '2', email, name },
    token: 'placeholder-token',
  });
});

module.exports = router;
