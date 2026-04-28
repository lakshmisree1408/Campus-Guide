const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Business = require('./models/Business');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Business.deleteMany();
    
    const user = await User.create({
      name: 'Admin',
      email: 'admin@campus.edu',
      password: 'password',
      role: 'owner'
    });
    
    await Business.create([
      {
        name: 'The Coffee Lab',
        category: 'Cafe',
        location: 'North Campus',
        description: 'Great place for late night studying with free Wi-Fi and artisanal coffee.',
        contactInfo: '123-456-7890',
        claimedBy: user._id,
        averageRating: 0
      },
      {
        name: 'Burger Joint',
        category: 'Restaurant',
        location: 'South Campus',
        description: 'Juicy burgers and amazing fries at student friendly prices.',
        contactInfo: '987-654-3210',
        claimedBy: user._id,
        averageRating: 0
      }
    ]);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
