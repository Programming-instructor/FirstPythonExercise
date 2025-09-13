const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const Student = require('../models/student.model');
const XLSX = require('xlsx');
const AcademicAdvisor = require('../models/academicAdvisor.model');
const EducationalDeputy = require('../models/educationalDeputy.model');
const Principal = require('../models/principal.model');
const PsychCounselor = require('../models/psychCounselor.model');
const jwt = require('jsonwebtoken');
const disciplinaryDeputy = require('../models/disciplinaryDeputy.model');
const Class = require('../models/class.model');

// ==== Multer setup for images ====
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../Uploads/students');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png images are allowed'), false);
  }
};

exports.uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
});

// ==== Multer setup for Excel files ====
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../Uploads/excel');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});

const excelFileFilter = (req, file, cb) => {
  const allowedTypes = /xlsx|xls/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx and .xls files are allowed'), false);
  }
};

exports.uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for Excel files
});

// ==== Get all students (with search & pagination) ====
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const searchQuery = search
      ? {
        $or: [
          { first_name: new RegExp(search, 'i') },
          { last_name: new RegExp(search, 'i') },
          { national_code: new RegExp(search, 'i') },
          { student_phone: new RegExp(search, 'i') },
          { father_phone: new RegExp(search, 'i') },
          { mother_phone: new RegExp(search, 'i') },
        ],
      }
      : {};

    const students = await Student.find(searchQuery)
      .sort({ _id: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Student.countDocuments(searchQuery);

    res.status(200).json({
      students,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};

// ==== Create student controller ====
exports.createStudent = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      father_name,
      mother_name,
      national_code,
      birth_date,
      birth_certificate_number,
      student_phone,
      father_phone,
      father_job,
      mother_phone,
      academic_year,
      education_level,
      mother_job,
      grade,
      emergency_phone,
      marital_status,
      guardian,
      previous_school_address,
      home_address,
      residence_status,
      postal_code,
      home_phone,
      student_goal,
      academic_status,
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
        url: `/Uploads/students/${req.file.filename}`,
        public_id: req.file.filename,
      };
    }

    const newStudent = new Student({
      first_name,
      last_name,
      father_name,
      mother_name,
      national_code,
      birth_date,
      birth_certificate_number,
      student_phone,
      father_phone,
      father_job,
      mother_phone,
      academic_year,
      education_level,
      mother_job,
      grade,
      emergency_phone,
      marital_status,
      guardian: guardian ? JSON.parse(guardian) : undefined,
      previous_school_address,
      home_address,
      residence_status,
      postal_code,
      home_phone,
      student_goal,
      academic_status,
      student_portrait_front,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Enum translations for Persian
const translations = {
  marital_status: {
    single: 'مجرد',
    married: 'متاهل',
    divorced: 'طلاق گرفته',
    widowed: 'بیوه'
  },
  residence_status: {
    'مالک': 'مالک',
    'مستاجر': 'مستاجر',
    'سایر': 'سایر'
  },
  academic_status: {
    high: 'بالا',
    medium: 'متوسط',
    low: 'پایین'
  },
};

// ==== Import students from Excel ====
exports.importStudentsFromExcel = async (req, res) => {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لطفاً فایل اکسل را آپلود کنید' });
    }

    filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    // Validate headers
    const requiredHeaders = ['نام', 'نام خانوادگی', 'کد ملی'];
    const headers = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0];
    const missingHeaders = requiredHeaders.filter(
      (header) =>
        !headers.includes(header) &&
        !headers.includes(
          header.replace('نام', 'first_name').replace('نام خانوادگی', 'last_name').replace('کد ملی', 'national_code')
        )
    );
    if (missingHeaders.length > 0) {
      return res.status(400).json({ message: `ستون‌های ضروری وجود ندارند: ${missingHeaders.join(', ')}` });
    }

    let addedCount = 0;
    let skippedCount = 0;
    let skippedRows = [];

    const phoneRegex = /^09\d{9}$/;
    const nationalCodeRegex = /^\d{10}$/;
    const homePhoneRegex = /^\d{8,11}$/;
    const validMaritalStatus = ['single', 'married', 'divorced', 'widowed'];
    const validResidenceStatus = ['مالک', 'مستاجر', 'سایر'];
    const validAcademicStatus = ['high', 'medium', 'low'];

    // Map Persian values to English for enum fields
    const maritalStatusMap = {
      'مجرد': 'single',
      'متاهل': 'married',
      'مطلقه': 'divorced', // Handle alternative Persian term for 'divorced'
      'طلاق گرفته': 'divorced',
      'بیوه': 'widowed',
    };
    const residenceStatusMap = {
      'مالک': 'مالک',
      'مستاجر': 'مستاجر',
      'سایر': 'سایر',
    };
    const academicStatusMap = {
      'بالا': 'high',
      'متوسط': 'medium',
      'پایین': 'low',
    };

    for (let row of sheetData) {
      const maritalStatusInput = row['وضعیت تاهل'] || row['marital_status'] || '';
      const residenceStatusInput = row['وضعیت سکونت'] || row['residence_status'] || '';
      const academicStatusInput = row['وضعیت تحصیلی'] || row['academic_status'] || '';

      const guardianName = row['نام ولی'] || row['guardian_name'] || '';
      const guardianRelation = row['نسبت ولی'] || row['guardian_relation'] || '';
      const guardianPhone = row['تلفن ولی'] || row['guardian_phone'] || '';

      let guardian;
      if (guardianPhone || guardianName || guardianRelation) {
        guardian = {
          name: guardianName,
          relation: guardianRelation,
          phone: guardianPhone,
        };
      }

      const studentData = {
        first_name: row['نام'] || row['first_name'] || '',
        last_name: row['نام خانوادگی'] || row['last_name'] || '',
        father_name: row['نام پدر'] || row['father_name'] || '',
        mother_name: row['نام مادر'] || row['mother_name'] || '',
        national_code: row['کد ملی'] || row['national_code'] || '',
        birth_date: row['تاریخ تولد'] || row['birth_date'] || '',
        birth_certificate_number: row['شماره شناسنامه'] || row['birth_certificate_number'] || '',
        student_phone: row['تلفن دانش‌آموز'] || row['student_phone'] || '',
        father_phone: row['تلفن پدر'] || row['father_phone'] || '',
        father_job: row['شغل پدر'] || row['father_job'] || '',
        mother_phone: row['تلفن مادر'] || row['mother_phone'] || '',
        academic_year: row['سال تحصیلی'] || row['academic_year'] || '',
        education_level: row['مقطع تحصیلی'] || row['education_level'] || '',
        mother_job: row['شغل مادر'] || row['mother_job'] || '',
        grade: row['پایه تحصیلی'] || row['grade'] ? Number(row['پایه تحصیلی'] || row['grade']) : undefined,
        emergency_phone: row['تلفن اضطراری'] || row['emergency_phone'] || '',
        marital_status: maritalStatusMap[maritalStatusInput] || (validMaritalStatus.includes(maritalStatusInput) ? maritalStatusInput : ''),
        guardian,
        previous_school_address: row['آدرس مدرسه قبلی'] || row['previous_school_address'] || '',
        home_address: row['آدرس منزل'] || row['home_address'] || '',
        residence_status: residenceStatusMap[residenceStatusInput] || (validResidenceStatus.includes(residenceStatusInput) ? residenceStatusInput : ''),
        postal_code: row['کد پستی'] || row['postal_code'] || '',
        home_phone: row['تلفن منزل'] || row['home_phone'] || '',
        student_goal: row['هدف دانش‌آموز'] || row['student_goal'] || '',
        academic_status: academicStatusMap[academicStatusInput] || (validAcademicStatus.includes(academicStatusInput) ? academicStatusInput : ''),
      };


      // Validate required fields
      const requiredFields = [
        'first_name',
        'last_name',
        'father_name',
        'mother_name',
        'national_code',
        'birth_date',
        'birth_certificate_number',
        'student_phone',
        'father_phone',
        'father_job',
        'mother_phone',
        'academic_year',
        'education_level',
        'mother_job',
        'emergency_phone',
        'marital_status',
        'previous_school_address',
        'home_address',
        'residence_status',
        'postal_code',
        'home_phone',
        'student_goal',
        'academic_status',
      ];

      const missingFields = requiredFields.filter(
        (field) => studentData[field] === '' || studentData[field] === null || studentData[field] === undefined
      );
      if (missingFields.length > 0) {
        skippedCount++;
        skippedRows.push({ row, reason: `Missing or empty fields: ${missingFields.join(', ')}` });
        continue;
      }

      // Validate regex and enum fields
      if (!nationalCodeRegex.test(studentData.national_code)) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Invalid national_code format' });
        continue;
      }
      if (
        !phoneRegex.test(studentData.student_phone) ||
        !phoneRegex.test(studentData.father_phone) ||
        !phoneRegex.test(studentData.mother_phone) ||
        !phoneRegex.test(studentData.emergency_phone)
      ) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Invalid phone number format' });
        continue;
      }
      if (!homePhoneRegex.test(studentData.home_phone)) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Invalid home_phone format' });
        continue;
      }
      if (!validMaritalStatus.includes(studentData.marital_status)) {
        skippedCount++;
        skippedRows.push({ row, reason: `Invalid marital_status: ${studentData.marital_status}` });
        continue;
      }
      if (!validResidenceStatus.includes(studentData.residence_status)) {
        skippedCount++;
        skippedRows.push({ row, reason: `Invalid residence_status: ${studentData.residence_status}` });
        continue;
      }
      if (!validAcademicStatus.includes(studentData.academic_status)) {
        skippedCount++;
        skippedRows.push({ row, reason: `Invalid academic_status: ${studentData.academic_status}` });
        continue;
      }
      if (studentData.guardian) {
        if (!studentData.guardian.name || !studentData.guardian.relation || !phoneRegex.test(studentData.guardian.phone)) {
          skippedCount++;
          skippedRows.push({ row, reason: 'Invalid guardian data: missing name, relation, or invalid phone' });
          continue;
        }
      }

      // Prevent duplicates
      const exists = await Student.findOne({ national_code: studentData.national_code });
      if (exists) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Duplicate national_code' });
        continue;
      }

      try {
        const student = new Student(studentData);
        const savedStudent = await student.save();
        addedCount++;
      } catch (err) {
        console.error('Error saving student:', err);
        if (err.code === 11000) {
          skippedCount++;
          skippedRows.push({ row, reason: `Duplicate key error: ${JSON.stringify(err.keyValue)}` });
        } else {
          skippedCount++;
          skippedRows.push({ row, reason: err.message });
        }
      }
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log('Import complete:', { addedCount, skippedCount, skippedRows });
    res.status(201).json({
      message: 'وارد کردن دانش‌آموزان با موفقیت انجام شد',
      added: addedCount,
      skipped: skippedCount,
      skippedRows,
    });
  } catch (err) {
    console.error('Server error:', err);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};

// ==== Export all students to Excel ====
exports.exportStudentsToExcel = async (req, res) => {
  try {
    const students = await Student.find().lean();

    const exportData = students.map((s) => ({
      'نام': s.first_name,
      'نام خانوادگی': s.last_name,
      'نام پدر': s.father_name,
      'نام مادر': s.mother_name,
      'کد ملی': s.national_code,
      'تاریخ تولد': s.birth_date,
      'شماره شناسنامه': s.birth_certificate_number,
      'تلفن دانش‌آموز': s.student_phone,
      'تلفن پدر': s.father_phone,
      'شغل پدر': s.father_job,
      'تلفن مادر': s.mother_phone,
      'سال تحصیلی': s.academic_year,
      'مقطع تحصیلی': s.education_level,
      'شغل مادر': s.mother_job,
      'پایه تحصیلی': s.grade,
      'تلفن اضطراری': s.emergency_phone,
      'وضعیت تاهل': translations.marital_status[s.marital_status] || s.marital_status,
      'نام ولی': s.guardian?.name || '',
      'نسبت ولی': s.guardian?.relation || '',
      'تلفن ولی': s.guardian?.phone || '',
      'آدرس مدرسه قبلی': s.previous_school_address,
      'آدرس منزل': s.home_address,
      'وضعیت سکونت': translations.residence_status[s.residence_status] || s.residence_status,
      'کد پستی': s.postal_code,
      'تلفن منزل': s.home_phone,
      'هدف دانش‌آموز': s.student_goal,
      'وضعیت تحصیلی': translations.academic_status[s.academic_status] || s.academic_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'دانش‌آموزان');

    // Use a temporary directory for the file
    const tempDir = path.join(__dirname, '../temp');
    try {
      // Check if directory exists; create it if it doesn't
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating temp directory:', err);
      throw new Error('خطا در ایجاد پوشه موقت');
    }

    const filePath = path.join(tempDir, `students_export_${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, 'students.xlsx', (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};

exports.getStudentByNationalCode = async (req, res) => {
  try {
    const { national_code } = req.params;

    // Validate national code
    const nationalCodeRegex = /^\d{10}$/;
    if (!national_code || !nationalCodeRegex.test(national_code)) {
      return res.status(400).json({ message: 'کد ملی نامعتبر است' });
    }

    const student = await Student.findOne({ national_code }).lean();

    if (!student) {
      return res.status(404).json({ message: 'دانش‌آموزی با این کد ملی یافت نشد' });
    }

    res.status(200).json({
      message: 'دانش‌آموز با موفقیت یافت شد',
      student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};


exports.getDecisionsByNationalCode = async (req, res) => {
  const { nationalCode } = req.params;

  try {
    const student = await Student.findOne({ national_code: nationalCode });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentId = student._id;

    const academicAdvisorRecord = await AcademicAdvisor.findOne({ studentId });
    const educationalDeputyRecord = await EducationalDeputy.findOne({ studentId });
    const disciplinaryDeputyRecord = await disciplinaryDeputy.findOne({ studentId });
    const principalRecord = await Principal.findOne({ studentId });
    const psychCounselorRecord = await PsychCounselor.findOne({ studentId });

    const decisions = {
      academicAdvisor: academicAdvisorRecord ? academicAdvisorRecord.advisorDecision : null,
      educationalDeputy: educationalDeputyRecord ? educationalDeputyRecord.deputyDecision : null,
      disciplinaryDeputy: disciplinaryDeputyRecord ? disciplinaryDeputyRecord.deputyDecision : null,
      principal: principalRecord ? principalRecord.principalDecision : null,
      psychCounselor: psychCounselorRecord ? psychCounselorRecord.psychDecision : null,
    };

    res.json(decisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.report = async (req, res) => {
  const { message, date, studentId, userId } = req.body;
  if (!message || !date || !studentId || !userId) {
    return res.status(400).json({ message: "Message, date, studentId and user are required." })
  }
  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.reports.push({ date, message, from: userId });

    await student.save();

    res.json({ message: 'Report added successfully', reports: student.r });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Generate and Send OTP Controller for Student
exports.sendOTP = async (req, res) => {
  try {
    const { student_phone } = req.body;
    if (!student_phone) {
      return res.status(400).json({ message: 'Student phone number is required' });
    }
    const user = await Student.findOne({ student_phone });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!user.accepted) {
      return res.status(403).json({ message: 'Student account not accepted yet' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();
    console.log(`OTP for ${student_phone}: ${otp}`);
    res.status(200).json({ message: 'OTP generated and logged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check OTP Controller for Student
exports.checkOTP = async (req, res) => {
  try {
    const { student_phone, otp } = req.body;
    if (!student_phone || !otp) {
      return res.status(400).json({ message: 'Student phone number and OTP are required' });
    }
    const user = await Student.findOne({ student_phone });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    res.status(200).json({ message: 'OTP is valid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login Controller for Student
exports.login = async (req, res) => {
  try {
    const { student_phone, otp } = req.body;
    if (!student_phone || !otp) {
      return res.status(400).json({ message: 'Student phone number and OTP are required' });
    }
    const user = await Student.findOne({ student_phone });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!user.accepted) {
      return res.status(403).json({ message: 'Student account not accepted yet' });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, firstName: user.first_name, lastName: user.last_name, loggedInAs: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      student: {
        id: user._id,
        student_phone: user.student_phone,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Current Student Controller
exports.currentStudent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const user = await Student.findById(req.user.userId).select('-otp -otpExpires').populate('class');
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({
      id: user._id,
      student_phone: user.student_phone,
      firstName: user.first_name,
      lastName: user.last_name,
      cls: user.class.name,
      nCode: user.national_code
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Reports for Student
exports.getReports = async (req, res) => {
  const { ncode } = req.params;

  if (!ncode) {
    return res.status(400).json({ message: 'national code is required' });
  }
  try {
    const student = await Student.findOne({ national_code: ncode }).populate('reports.from');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({
      amount: student.reports.length,
      reports: student.reports
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { national_code } = req.params; // Assuming national_code is passed as a URL parameter

    // Find the student by national_code and select only _id and class
    const student = await Student.findOne({ national_code }).select('_id class');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If student has no class assigned, return zeros and empty array
    if (!student.class) {
      return res.json({
        numOfPres: 0,
        numOfAbs: 0,
        numOfLate: 0,
        fullAttendance: []
      });
    }

    // Find the class and populate the teacher in attendance records
    const classDoc = await Class.findById(student.class)
      .populate('attendance.teacher')
      .select('attendance');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Initialize counts and full attendance array
    let numOfPres = 0;
    let numOfAbs = 0;
    let numOfLate = 0;
    const fullAttendance = [];

    // Loop through each attendance record in the class
    classDoc.attendance.forEach(att => {
      // Find the student's attendance status in this record
      const studentAtt = att.studentsAttendance.find(sa => sa.student.equals(student._id));
      if (studentAtt) {
        const status = studentAtt.status;
        if (status === 'present') numOfPres++;
        else if (status === 'absent') numOfAbs++;
        else if (status === 'late') numOfLate++;

        fullAttendance.push({
          date: att.date,
          subject: att.subject,
          teacher: att.teacher, // Populated teacher object
          attendance: status // Corrected from 'attendace' to 'attendance'
        });
      }
    });

    return res.json({
      numOfPres,
      numOfAbs,
      numOfLate,
      fullAttendance
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { 'reports._id': reportId },
      { $set: { 'reports.$.confirmed': true } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.editReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { message, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    if (!message && !date) {
      return res.status(400).json({ message: 'At least one field (message or date) is required to update' });
    }

    const updateFields = {};
    if (message) updateFields['reports.$.message'] = message;
    if (date) updateFields['reports.$.date'] = date;

    const updatedStudent = await Student.findOneAndUpdate(
      { 'reports._id': reportId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getConfirmedReportsByNationalCode = async (req, res) => {
  try {
    const { nationalCode } = req.params;

    const student = await Student.findOne({ national_code: nationalCode })
      .select('first_name last_name national_code reports class')
      .populate('reports.from', 'name role')
      .populate({
        path: 'class',
        select: 'attendance',
        populate: {
          path: 'attendance.teacher',
          select: 'name'
        }
      })
      .lean();

    if (!student) {
      return res.status(404).json({ message: 'دانش‌آموز پیدا نشد' });
    }

    const confirmed = [];

    (student.reports || []).forEach((r) => {
      if (r.confirmed) {
        let ts = null;

        if (r.updatedAt) {
          ts = new Date(r.updatedAt);
        } else if (r._id && typeof r._id.getTimestamp === 'function') {
          try {
            ts = r._id.getTimestamp();
          } catch (e) {
            ts = null;
          }
        } else if (r.date) {
          ts = new Date(r.date);
        }

        confirmed.push({
          reportId: r._id,
          date: r.date || null,
          message: r.message || '',
          confirmed: true,
          from: r.from || null,
          student: {
            id: student._id,
            first_name: student.first_name,
            last_name: student.last_name,
            national_code: student.national_code,
          },
          _sortTs: ts ? ts.getTime() : 0,
        });
      }
    });

    confirmed.sort((a, b) => b._sortTs - a._sortTs);

    const reports = confirmed.map(({ _sortTs, ...rest }) => rest);

    const attendanceRecords = [];
    let present = 0, absent = 0, late = 0;

    if (student.class && student.class.attendance) {
      student.class.attendance.forEach(att => {
        if (att.confirmedBy && att.confirmedBy.disciplinaryDeputy && att.confirmedBy.principal) {
          const sa = att.studentsAttendance.find(s => s.student.toString() === student._id.toString());
          if (sa) {
            const record = {
              date: att.date,
              day: att.day,
              period: att.period,
              subject: att.subject,
              teacher: att.teacher,
              status: sa.status,
              _sortTs: new Date(att.date).getTime()
            };
            attendanceRecords.push(record);

            if (sa.status === 'present') present++;
            else if (sa.status === 'absent') absent++;
            else if (sa.status === 'late') late++;
          }
        }
      });

      attendanceRecords.sort((a, b) => b._sortTs - a._sortTs);
    }

    const attendance = attendanceRecords.map(({ _sortTs, ...rest }) => rest);

    res.status(200).json({
      reports,
      attendanceSummary: { present, absent, late },
      attendanceRecords: attendance
    });
  } catch (err) {
    console.error('Error getting confirmed reports:', err);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};


exports.getAllUnconfirmedReports = async (req, res) => {
  try {
    const students = await Student.find({ 'reports.confirmed': false })
      .select('first_name last_name national_code reports')
      .populate('reports.from', 'name role');

    const unconfirmedReports = [];

    students.forEach(student => {
      student.reports.forEach(report => {
        if (!report.confirmed) {
          unconfirmedReports.push({
            _id: report._id,
            date: report.date,
            message: report.message,
            from: report.from,
            student: {
              _id: student._id,
              first_name: student.first_name,
              last_name: student.last_name,
              national_code: student.national_code
            }
          });
        }
      });
    });

    res.status(200).json(unconfirmedReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const data = { ...req.body };
    if (data.guardian) {
      data.guardian = JSON.parse(data.guardian);
    }
    if (req.file) {
      // Delete old image if exists
      const oldStudent = await Student.findById(id);
      if (oldStudent && oldStudent.student_portrait_front?.public_id) {
        const oldImagePath = path.join(__dirname, '../Uploads/students', oldStudent.student_portrait_front.public_id);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      data.student_portrait_front = {
        url: `/Uploads/students/${req.file.filename}`,
        public_id: req.file.filename,
      };
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Delete image if exists
    if (student.student_portrait_front?.public_id) {
      const imagePath = path.join(__dirname, '../Uploads/students', student.student_portrait_front.public_id);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};