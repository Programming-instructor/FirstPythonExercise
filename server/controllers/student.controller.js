const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Student = require('../models/student.model');

// ==== Multer setup ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/students');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png images are allowed'));
  }
};

exports.upload = multer({ storage, fileFilter });

// ==== Create student controller ====
exports.createStudent = async (req, res) => {
  try {
    const { 
      first_name, last_name, father_name, mother_name, national_code,
      birth_date, birth_certificate_number, student_phone, father_phone,
      father_job, mother_phone, academic_year, education_level, mother_job,
      grade, emergency_phone, marital_status, guardian, previous_school_address,
      home_address, residence_status, postal_code, home_phone, appearance_neat,
      polite_behavior, family_involvement, student_goal, academic_status,
      commitment, evaluation_result
    } = req.body;

    // Check duplicates
    const existingNC = await Student.findOne({ national_code });
    if (existingNC) return res.status(400).json({ message: 'National code already exists' });

    const existingHP = await Student.findOne({ home_phone });
    if (existingHP) return res.status(400).json({ message: 'Home phone already exists' });

    // File handling
    let student_portrait_front = {};
    if (req.file) {
      student_portrait_front = {
        url: `/uploads/students/${req.file.filename}`,
        public_id: req.file.filename // In local uploads, we just store filename
      };
    }

    const newStudent = new Student({
      first_name, last_name, father_name, mother_name, national_code,
      birth_date, birth_certificate_number, student_phone, father_phone,
      father_job, mother_phone, academic_year, education_level, mother_job,
      grade, emergency_phone, marital_status,
      guardian: guardian ? JSON.parse(guardian) : undefined, // handle JSON from form-data
      previous_school_address, home_address, residence_status, postal_code,
      home_phone, appearance_neat, polite_behavior, family_involvement,
      student_goal, academic_status,
      commitment: commitment ? JSON.parse(commitment) : undefined,
      evaluation_result,
      student_portrait_front
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};