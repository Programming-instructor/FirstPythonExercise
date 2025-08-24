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
      'register_student',        // For "ثبت نام هنرجوی جدید" (/admin/register-student)
      'manage_students',        // For "لیست دانش آموزان" (/admin/students)
      'register_teachers',      // For "ثبت نام اساتید" (/admin/dashboard)
      'evaluate_performance',   // For "ارزیابی و عملکرد" (/admin/dashboard)
      'academic_counseling',    // For "واحد مشاوره تحصیلی" (/admin/academic-counseling)
      'educational_deputy',     // For "معاونت آموزشی" (/admin/educational-deputy)
      'psych_counselor',        // For "مشاور روانکاوی" (/admin/psych-counselor)
      'principal',              // For "مدیر" (/admin/principal)
      'manage_users',           // For "مدیریت کاربران ویژه" (/admin/dashboard)
    ],
  },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);