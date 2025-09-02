const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String },
  role: { type: String, required: true },
  name: String,
  otp: String,
  otpExpires: Date,
  permissions: {
    type: [String],
    default: [],
    enum: [
      'register_student',
      'manage_students',
      'register_teachers',
      'evaluate_performance',
      'academic_counseling',
      'educational_deputy',
      'psych_counselor',
      'principal',
      'manage_users',
      'disciplinary_deputy',
    ],
  },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);