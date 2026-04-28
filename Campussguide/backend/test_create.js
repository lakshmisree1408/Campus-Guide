const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Business = require('./models/Business');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const testCreate = async () => {
  try {
    await connectDB();
    const user = await User.findOne({});
    if (!user) {
        console.log("No user found");
        process.exit(1);
    }
    const business = new Business({
      name: 'Test',
      category: 'Other',
      location: 'Test Loc',
      description: 'Test Desc',
      contactInfo: '',
      imageUrl: '',
      claimedBy: user._id,
    });
    const saved = await business.save();
    console.log("Success:", saved);
    process.exit(0);
  } catch (err) {
    console.error("Error creating:", err);
    process.exit(1);
  }
};
testCreate();
