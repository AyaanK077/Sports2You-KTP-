const mongoose = require('mongoose');
require('dotenv').config({ override: true });
const Facility = require('../models/Facility');

const seedFacilities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || 'sports2you',
    });

    console.log('Connected to MongoDB for seeding...');

    // Clear existing facilities
    await Facility.deleteMany({});
    console.log('Cleared existing facilities');

    // Sample facilities data
    const facilities = [
      {
        id: 'ac',
        name: 'Activity Center',
        location: 'Main Campus',
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
        location: 'West Campus',
        courts: [
          { id: 'rec-main', name: 'Main Court', sports: ['basketball', 'soccer'] },
        ],
      },
    ];

    // Insert facilities
    const result = await Facility.insertMany(facilities);
    console.log(`✅ Seeded ${result.length} facilities successfully!`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedFacilities();
