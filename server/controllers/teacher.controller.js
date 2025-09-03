// Edited backend controllers file: controllers/teacher.controller.js
const Teacher = require('../models/teacher.model');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');

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

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('first_name last_name mobile _id numberOfReports');
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate and Send OTP Controller
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }
    const user = await Teacher.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
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
    const user = await Teacher.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      console.log('valid');
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    res.status(200).json({ message: 'OTP is valid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Current Teacher Controller
exports.currentTeacher = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const user = await Teacher.findById(req.user.userId).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({
      id: user._id,
      mobile: user.mobile,
      firstName: user.first_name,
      lastName: user.last_name,
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }
    const user = await Teacher.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    console.log('here');
    const token = jwt.sign(
      { userId: user._id, firstName: user.first_name, lastName: user.last_name, loggedInAs: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      teacher: {
        id: user._id,
        mobile: user.mobile,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReports = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }
  try {
    const teach = await Teacher.findById(id);
    res.status(200).json({
      amount: teach.numberOfReports,
      reports: teach.reports
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Add a report (warning) to a teacher
exports.addReportToTeacher = async (req, res) => {
  try {
    const { teacherId, date, message } = req.body;
    if (!teacherId || !date || !message) {
      return res.status(400).json({ message: 'teacherId, date, and message are required' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.reports.push({ date, message });
    teacher.numberOfReports = teacher.reports.length;

    await teacher.save();

    res.json({ message: 'Report added successfully', reports: teacher.reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editTeacher = async (req, res) => {
  try {
    // Handle file upload
    uploadTeacherImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }

      const { id } = req.params; // Teacher ID from URL params
      const {
        mobile,
        first_name,
        last_name,
        birth_date,
        birth_certificate_number,
        national_code,
        academic_year,
        academic_level,
      } = req.body;

      // Validate teacher ID
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID is required',
        });
      }

      // Find the teacher
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found',
        });
      }

      // Validate national_code if provided
      if (national_code && !/^\d{10}$/.test(national_code)) {
        return res.status(400).json({
          success: false,
          message: 'National code must be exactly 10 digits',
        });
      }

      // Validate academic_level if provided
      const validStatuses = [
        'high_school_diploma',
        'teaching_diploma',
        'associate_degree',
        'bachelor_degree',
        'master_degree',
        'doctoral_degree',
        'postdoctoral',
        'other_certification',
      ];
      if (academic_level && !validStatuses.includes(academic_level)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid academic level',
        });
      }

      // Prepare update data
      const updateData = {};
      if (mobile) updateData.mobile = mobile;
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (birth_date) updateData.birth_date = birth_date;
      if (birth_certificate_number) updateData.birth_certificate_number = birth_certificate_number;
      if (national_code) updateData.national_code = national_code;
      if (academic_year) updateData.academic_year = academic_year;
      if (academic_level) updateData.academic_level = academic_level;

      // Handle image update if provided
      if (req.file) {
        // Optionally, delete the old image if it exists
        if (teacher.teacher_portrait_front && teacher.teacher_portrait_front.public_id) {
          const oldImagePath = path.join(__dirname, '../Uploads/teachers', teacher.teacher_portrait_front.public_id);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.teacher_portrait_front = {
          url: `/Uploads/teachers/${req.file.filename}`,
          public_id: req.file.filename,
        };
      }

      // Update teacher
      const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validators are run
      });

      res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        data: updatedTeacher,
      });
    });
  } catch (error) {
    // Handle duplicate national_code or mobile
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'National code or mobile number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params; // Teacher ID from URL params

    // Validate teacher ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required',
      });
    }

    // Find the teacher
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Delete associated image if it exists
    if (teacher.teacher_portrait_front && teacher.teacher_portrait_front.public_id) {
      const imagePath = path.join(__dirname, '../Uploads/teachers', teacher.teacher_portrait_front.public_id);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the teacher
    await Teacher.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).select('-otp -otpExpires');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};