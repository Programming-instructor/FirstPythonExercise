const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Login Controller
exports.login = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    // Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful login
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, isAdmin: user.isAdmin, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add User Controller (Admin only)
exports.addUser = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const { username, mobile, role, name, permissions } = req.body;

    // Validate input
    if (!username || !mobile || !role || !name) {
      return res.status(400).json({ message: 'Username, mobile, role, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or mobile already exists' });
    }

    // Create new user
    const user = new User({
      username,
      mobile,
      role,
      name,
      permissions: permissions || [],
      isAdmin: role === 'admin' ? true : false
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Generate and Send OTP Controller
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({ message: 'OTP generated and logged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check OTP Controller
exports.checkOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP is valid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.currentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized.' })
    }

    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  }
  catch (error) {
    console.error('ERROR FETHCING USER: ', error)
    res.status(500).json({ message: 'Server error' });
  }
}