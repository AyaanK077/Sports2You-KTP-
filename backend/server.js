const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: true });

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const facilitiesRoutes = require('./routes/facilities');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/facilities', facilitiesRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Sports2You backend is running!', status: 'ok' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Sports2You backend is running', status: 'ok' });
});
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Sports2You backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
