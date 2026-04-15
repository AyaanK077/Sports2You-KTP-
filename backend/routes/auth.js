const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeUser = (userDoc) => ({
  id: String(userDoc._id),
  name: userDoc.name,
  email: userDoc.email,
  studentId: userDoc.studentId || '',
  phone: userDoc.phone || '',
  joinedDate: (userDoc.createdAt || new Date()).toISOString().split('T')[0],
});

const createToken = (userId) =>
  jwt.sign(
    { userId: String(userId) },
    process.env.JWT_SECRET || 'sports2you-dev-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const isUtdEmail = (email) => {
  const normalized = String(email || '').toLowerCase();
  return normalized.endsWith('@utdallas.edu') || normalized.endsWith('@mail.utdallas.edu');
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user: normalizeUser(user),
      token: createToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, name, studentId } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (!isUtdEmail(email)) {
    return res.status(400).json({ error: 'Use a valid UTD email address' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      studentId: studentId ? String(studentId).trim() : null,
    });

    return res.status(201).json({
      message: 'Account created',
      user: normalizeUser(user),
      token: createToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

module.exports = router;
