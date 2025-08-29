const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  father_name: { type: String, required: true },
  mother_name: { type: String, required: true },
  national_code: {
    type: String, required: true, unique: true,
    match: /^\d{10}$/ // ← دقیقاً 10 رقم
  },
  birth_date: { type: String, required: true },
  birth_certificate_number: { type: String, required: true },
  student_phone: {
    type: String, required: true, match: /^09\d{9}$/
  },
  father_phone: {
    type: String, required: true, match: /^09\d{9}$/
  },
  father_job: { type: String, required: true },
  mother_phone: {
    type: String, required: true, match: /^09\d{9}$/
  },
  academic_year: { type: String, required: true },
  education_level: { type: String, enum: ['10', '11', '12'], required: true },
  mother_job: { type: String, required: true },
  grade: { type: Number },

  emergency_phone: {
    type: String, required: true, match: /^09\d{9}$/
  },
  marital_status: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    required: true
  },
  guardian: {
    name: { type: String, required: function () { return this.guardian?.phone; } },
    relation: { type: String, required: function () { return this.guardian?.phone; } },
    phone: { type: String, match: /^09\d{9}$/, required: false }
  },

  previous_school_address: { type: String, required: true },
  home_address: { type: String, required: true },
  residence_status: {
    type: String,
    enum: ['مالک', 'مستاجر', 'سایر'],
    required: true
  },
  postal_code: { type: String, required: true },
  home_phone: { type: String, required: true, unique: true, match: /^\d{8,11}$/, },
  student_goal: { type: String, required: true },
  academic_status: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  student_portrait_front: {
    url: { type: String, required: false },
    public_id: { type: String, required: false }
  },
  accepted: { type: Boolean, default: false },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
});

const Student = mongoose.model('Student', studentSchema, 'student');

module.exports = Student;
