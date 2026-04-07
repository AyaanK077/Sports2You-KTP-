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
        short: 'AC',
        address: '800 W Campbell Rd, Richardson, TX 75080',
        image: 'activity.png',
        description: "UTD's main athletic facility featuring 3 full-size basketball courts and a flexible side gym for basketball and soccer.",
        hours: {
          Sunday: '12:00 PM – 1:00 AM',
          Monday: '7:00 AM – 1:00 AM',
          Tuesday: '7:00 AM – 1:00 AM',
          Wednesday: '7:00 AM – 1:00 AM',
          Thursday: '7:00 AM – 1:00 AM',
          Friday: '7:00 AM – 10:00 PM',
          Saturday: '8:00 AM – 10:00 PM',
        },
        openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
        closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
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
        short: 'Rec West',
        address: '2050 Waterview Pkwy, Richardson, TX 75080',
        image: 'hoop.png',
        description: 'A modern recreation facility on the west side of campus with a large multi-sport court available for basketball and soccer.',
        hours: {
          Sunday: '12:00 PM – 1:00 AM',
          Monday: '7:00 AM – 1:00 AM',
          Tuesday: '7:00 AM – 1:00 AM',
          Wednesday: '7:00 AM – 1:00 AM',
          Thursday: '7:00 AM – 1:00 AM',
          Friday: '7:00 AM – 10:00 PM',
          Saturday: '8:00 AM – 10:00 PM',
        },
        openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
        closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
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
