const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Login Controller
exports.login = async (req, res) => {
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
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role, isAdmin: user.isAdmin, name: user.name, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add User Controller (Admin only)
exports.addUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    const { mobile, role, name, permissions } = req.body;
    if (!mobile || !role || !name) {
      return res.status(400).json({ message: 'Mobile, role, and name are required' });
    }
    if (!validator.isMobilePhone(mobile, 'any')) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }
    const validRoles = ['principal', 'academic_counseling', 'educational_deputy', 'psych_counselor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }
    const validPermissions = [
      'register_student',
      'manage_students',
      'register_teachers',
      'evaluate_performance',
      'academic_counseling',
      'educational_deputy',
      'psych_counselor',
      'principal',
      'manage_users',
    ];
    if (permissions && !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions must be an array' });
    }
    if (permissions && permissions.some(p => !validPermissions.includes(p))) {
      return res.status(400).json({ message: `Invalid permissions. Must be one of: ${validPermissions.join(', ')}` });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }
    // Sanitize inputs
    const sanitizedName = validator.escape(name);
    const sanitizedMobile = validator.escape(mobile);
    // Create new user
    const user = new User({
      mobile: sanitizedMobile,
      role,
      name: sanitizedName,
      permissions: permissions || [],
      isAdmin: role === 'admin',
    });
    await user.save();
    // Log admin action
    console.log(`Admin ${req.user.name} created user ${sanitizedName} with role ${role}`);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Users Controller (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    const users = await User.find().select('-otp -otpExpires');
    res.status(200).json({
      message: 'Users retrieved successfully',
      users: users.map(user => ({
        id: user._id,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
        isAdmin: user.isAdmin,
      })),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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

// Current User Controller
exports.currentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(req.user.userId).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      mobile: user.mobile,
      role: user.role,
      name: user.name,
      isAdmin: user.isAdmin,
      permissions: user.permissions,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};