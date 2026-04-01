const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = (process.env.MONGO_URI || '').trim();

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it in backend/.env');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'sports2you',
  });

  console.log('Connected to MongoDB Atlas');
};

module.exports = connectDB;
