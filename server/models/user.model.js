const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  mobile: { type: String },
  role: { type: String, required: true },
  name: String,
  otp: String,
  otpExpires: Date,
  permissions: { type: [String], default: [] },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);

