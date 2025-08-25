const Teacher = require('../models/teacher.model');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer specifically for teacher uploads
const teacherImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../Uploads/teachers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `teacher-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});

const uploadTeacherImage = multer({
  storage: teacherImageStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('teacher_portrait_front');

exports.addTeacher = async (req, res) => {
  try {
    // Handle file upload
    uploadTeacherImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }

      const {
        mobile,
        first_name,
        last_name,
        birth_date,
        birth_certificate_number,
        national_code,
        subjects,
        academic_year,
        academic_level
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !birth_date ||
        !birth_certificate_number || !national_code ||
        !academic_year || !academic_level || !mobile) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided',
        });
      }

      // Validate national_code format
      if (!/^\d{10}$/.test(national_code)) {
        return res.status(400).json({
          success: false,
          message: 'National code must be exactly 10 digits',
        });
      }

      // Validate academic_status
      const validStatuses = [
        'high_school_diploma',
        'teaching_diploma',
        'associate_degree',
        'bachelor_degree',
        'master_degree',
        'doctoral_degree',
        'postdoctoral',
        'other_certification'
      ];
      if (!validStatuses.includes(academic_level)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid academic level',
        });
      }

      // Create teacher object
      const teacherData = {
        mobile,
        first_name,
        last_name,
        birth_date,
        birth_certificate_number,
        national_code,
        subjects: subjects ? JSON.parse(subjects) : [],
        academic_year,
        academic_level,
      };

      // Add image data if uploaded
      if (req.file) {
        teacherData.teacher_portrait_front = {
          url: `/Uploads/teachers/${req.file.filename}`,
          public_id: req.file.filename,
        };
      }

      // Create and save new teacher
      const newTeacher = new Teacher(teacherData);
      await newTeacher.save();

      res.status(201).json({
        success: true,
        message: 'Teacher added successfully',
        data: newTeacher,
      });
    });
  } catch (error) {
    // Handle duplicate national_code or other errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'National code already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};