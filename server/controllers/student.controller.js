const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Student = require('../models/student.model');
const XLSX = require('xlsx');

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
      appearance_neat,
      polite_behavior,
      family_involvement,
      student_goal,
      academic_status,
      commitment,
      evaluation_result,
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
      appearance_neat,
      polite_behavior,
      family_involvement,
      student_goal,
      academic_status,
      commitment: commitment ? JSON.parse(commitment) : undefined,
      evaluation_result,
      student_portrait_front,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ==== Import students from Excel ====
exports.importStudentsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لطفاً فایل اکسل را آپلود کنید' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    // Required headers for validation
    const requiredHeaders = ['نام', 'نام خانوادگی', 'کد ملی']; // or their English equivalents
    const headers = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header) && !headers.includes(header.replace('نام', 'first_name').replace('نام خانوادگی', 'last_name').replace('کد ملی', 'national_code')));
    if (missingHeaders.length > 0) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(400).json({ message: `Missing required headers: ${missingHeaders.join(', ')}` });
    }

    let addedCount = 0;
    let skippedCount = 0;
    let skippedRows = [];

    for (let row of sheetData) {
      const studentData = {
        first_name: row['نام'] || row['first_name'],
        last_name: row['نام خانوادگی'] || row['last_name'],
        father_name: row['نام پدر'] || row['father_name'],
        mother_name: row['نام مادر'] || row['mother_name'],
        national_code: row['کد ملی'] || row['national_code'],
        birth_date: row['تاریخ تولد'] || row['birth_date'],
        birth_certificate_number: row['شماره شناسنامه'] || row['birth_certificate_number'],
        student_phone: row['تلفن دانش‌آموز'] || row['student_phone'],
        father_phone: row['تلفن پدر'] || row['father_phone'],
        father_job: row['شغل پدر'] || row['father_job'],
        mother_phone: row['تلفن مادر'] || row['mother_phone'],
        academic_year: row['سال تحصیلی'] || row['academic_year'],
        education_level: row['مقطع تحصیلی'] || row['education_level'],
        mother_job: row['شغل مادر'] || row['mother_job'],
        grade: row['پایه تحصیلی'] || row['grade'],
        emergency_phone: row['تلفن اضطراری'] || row['emergency_phone'],
        marital_status: row['وضعیت تاهل'] || row['marital_status'],
        guardian: row['ولی'] ? JSON.parse(row['ولی']) : undefined,
        previous_school_address: row['آدرس مدرسه قبلی'] || row['previous_school_address'],
        home_address: row['آدرس منزل'] || row['home_address'],
        residence_status: row['وضعیت سکونت'] || row['residence_status'],
        postal_code: row['کد پستی'] || row['postal_code'],
        home_phone: row['تلفن منزل'] || row['home_phone'],
        appearance_neat: row['ظاهر مرتب'] === 'بله' || row['appearance_neat'] === true,
        polite_behavior: row['رفتار مودبانه'] === 'بله' || row['polite_behavior'] === true,
        family_involvement: row['مشارکت خانواده'] === 'بله' || row['family_involvement'] === true,
        student_goal: row['هدف دانش‌آموز'] || row['student_goal'],
        academic_status: row['وضعیت تحصیلی'] || row['academic_status'],
        commitment: row['تعهد'] ? JSON.parse(row['تعهد']) : undefined,
        evaluation_result: row['نتیجه ارزیابی'] || row['evaluation_result'],
      };

      // Skip if missing required fields
      if (!studentData.first_name || !studentData.last_name || !studentData.national_code) {
        skippedCount++;
        skippedRows.push(row);
        continue;
      }

      // Prevent duplicates
      const exists = await Student.findOne({ national_code: studentData.national_code });
      if (exists) {
        skippedCount++;
        skippedRows.push(row);
        continue;
      }

      await Student.create(studentData);
      addedCount++;
    }

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'وارد کردن دانش‌آموزان با موفقیت انجام شد',
      added: addedCount,
      skipped: skippedCount,
      skippedRows,
    });
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Clean up on error
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
      'وضعیت تاهل': s.marital_status,
      'ولی': s.guardian ? JSON.stringify(s.guardian) : '',
      'آدرس مدرسه قبلی': s.previous_school_address,
      'آدرس منزل': s.home_address,
      'وضعیت سکونت': s.residence_status,
      'کد پستی': s.postal_code,
      'تلفن منزل': s.home_phone,
      'ظاهر مرتب': s.appearance_neat ? 'بله' : 'خیر',
      'رفتار مودبانه': s.polite_behavior ? 'بله' : 'خیر',
      'مشارکت خانواده': s.family_involvement ? 'بله' : 'خیر',
      'هدف دانش‌آموز': s.student_goal,
      'وضعیت تحصیلی': s.academic_status,
      'تعهد': JSON.stringify(s.commitment),
      'نتیجه ارزیابی': s.evaluation_result,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'دانش‌آموزان');

    const filePath = path.join(__dirname, '../Uploads/students_export.xlsx');
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, 'students.xlsx', (err) => {
      if (err) console.error(err);
      fs.unlinkSync(filePath); // Delete temp file after download
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطای سرور', error: err.message });
  }
};