const mongoose = require('mongoose');
const dotenv = require("dotenv");
const User = require('../models/user.model');

dotenv.config();

// Admin user data
const adminUser = {
  username: 'admin',
  mobile: '09123456789',
  role: 'admin',
  name: 'Admin User',
  permissions: ['all'],
  active: true,
  isAdmin: true,
};

// Seed admin user
async function seedAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: adminUser.username });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const newAdmin = new User(adminUser);
    await newAdmin.save();
    console.log('Admin user created successfully:', newAdmin.username);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedAdminUser();