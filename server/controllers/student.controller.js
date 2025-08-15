const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
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
  evaluation_result: {
    accepted: 'پذیرفته شده',
    notAccepted: 'پذیرفته نشده'
  }
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
    const validEvaluationResult = ['accepted', 'notAccepted'];

    // Map Persian values to English for enum fields
    const maritalStatusMap = {
      'مجرد': 'single',
      'متاهل': 'married',
      'مطلقه': 'divorced',
      'بیوه': 'widowed',
    };
    const academicStatusMap = {
      'بالا': 'high',
      'متوسط': 'medium',
      'پایین': 'low',
    };
    const evaluationResultMap = {
      'پذیرفته شده': 'accepted',
      'پذیرفته نشده': 'notAccepted',
    };

    for (let row of sheetData) {
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
        marital_status: maritalStatusMap[row['وضعیت تاهل'] || row['marital_status'] || ''] || row['وضعیت تاهل'] || row['marital_status'] || '',
        guardian: row['ولی']
          ? (() => {
            try {
              const parsed = JSON.parse(row['ولی']);
              return {
                name: parsed.name || '',
                relation: parsed.relation || '',
                phone: parsed.phone || '',
              };
            } catch {
              return undefined;
            }
          })()
          : undefined,
        previous_school_address: row['آدرس مدرسه قبلی'] || row['previous_school_address'] || '',
        home_address: row['آدرس منزل'] || row['home_address'] || '',
        residence_status: row['وضعیت سکونت'] || row['residence_status'] || '',
        postal_code: row['کد پستی'] || row['postal_code'] || '',
        home_phone: row['تلفن منزل'] || row['home_phone'] || '',
        appearance_neat: Boolean(
          row['ظاهر مرتب'] === 'بله' ||
          row['appearance_neat'] === true ||
          row['appearance_neat'] === 'true' ||
          row['appearance_neat'] === 1
        ),
        polite_behavior: Boolean(
          row['رفتار مودبانه'] === 'بله' ||
          row['polite_behavior'] === true ||
          row['polite_behavior'] === 'true' ||
          row['polite_behavior'] === 1
        ),
        family_involvement: Boolean(
          row['مشارکت خانواده'] === 'بله' ||
          row['family_involvement'] === true ||
          row['family_involvement'] === 'true' ||
          row['family_involvement'] === 1
        ),
        student_goal: row['هدف دانش‌آموز'] || row['student_goal'] || '',
        academic_status: academicStatusMap[row['وضعیت تحصیلی'] || row['academic_status'] || ''] || row['وضعیت تحصیلی'] || row['academic_status'] || '',
        commitment: row['تعهد']
          ? (() => {
            try {
              const parsed = JSON.parse(row['تعهد']);
              return {
                discipline: Boolean(parsed.discipline),
                rules: Boolean(parsed.rules),
              };
            } catch {
              return { discipline: false, rules: false };
            }
          })()
          : { discipline: false, rules: false },
        evaluation_result: evaluationResultMap[row['نتیجه ارزیابی'] || row['evaluation_result'] || ''] || row['نتیجه ارزیابی'] || row['evaluation_result'] || '',
      };

      console.log('Prepared studentData:', JSON.stringify(studentData, null, 2));

      // Validate required fields
      const requiredFields = [
        'first_name',
        'last_name',
        'national_code',
        'father_name',
        'mother_name',
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
        'appearance_neat',
        'polite_behavior',
        'family_involvement',
        'student_goal',
        'academic_status',
        'commitment',
        'evaluation_result',
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
      if (!validEvaluationResult.includes(studentData.evaluation_result)) {
        skippedCount++;
        skippedRows.push({ row, reason: `Invalid evaluation_result: ${studentData.evaluation_result}` });
        continue;
      }
      if (studentData.guardian && (!studentData.guardian.name || !studentData.guardian.relation || !phoneRegex.test(studentData.guardian.phone))) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Invalid guardian data' });
        continue;
      }

      // Prevent duplicates
      const exists = await Student.findOne({ national_code: studentData.national_code });
      if (exists) {
        skippedCount++;
        skippedRows.push({ row, reason: 'Duplicate national_code' });
        continue;
      }

      try {
        console.log('Mongoose connection state:', mongoose.connection.readyState);
        console.log('Attempting to save student...');
        const student = new Student(studentData);
        const savedStudent = await student.save(); // Use save() for better validation error handling
        console.log('Saved student:', savedStudent);
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
      'ولی': s.guardian ? JSON.stringify(s.guardian) : '',
      'آدرس مدرسه قبلی': s.previous_school_address,
      'آدرس منزل': s.home_address,
      'وضعیت سکونت': translations.residence_status[s.residence_status] || s.residence_status,
      'کد پستی': s.postal_code,
      'تلفن منزل': s.home_phone,
      'ظاهر مرتب': s.appearance_neat ? 'بله' : 'خیر',
      'رفتار مودبانه': s.polite_behavior ? 'بله' : 'خیر',
      'مشارکت خانواده': s.family_involvement ? 'بله' : 'خیر',
      'هدف دانش‌آموز': s.student_goal,
      'وضعیت تحصیلی': translations.academic_status[s.academic_status] || s.academic_status,
      'تعهد': JSON.stringify(s.commitment),
      'نتیجه ارزیابی': translations.evaluation_result[s.evaluation_result] || s.evaluation_result
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
