const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true, match: /^09\d{9}$/ },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: String, required: true },
  birth_certificate_number: { type: String, required: true },
  national_code: {
    type: String, required: true, unique: true,
    match: /^\d{10}$/ // ← دقیقاً 10 رقم
  },
  academic_year: { type: String, required: true },
  academic_level: {
    type: String,
    enum: [
      'high_school_diploma',
      'teaching_diploma',
      'associate_degree',
      'bachelor_degree',
      'master_degree',
      'doctoral_degree',
      'postdoctoral',
      'other_certification'
    ],
    required: true
  },
  teacher_portrait_front: {
    url: { type: String, required: false },
    public_id: { type: String, required: false }
  },
  otp: String,
  otpExpires: Date,
  numberOfReports: { type: Number, required: false },
  reports: [
    {
      date: { type: String, required: false },
      message: { type: String, required: false },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);