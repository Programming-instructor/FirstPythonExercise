const express = require('express');
const router = express.Router();
const { uploadImage, uploadExcel, createStudent, importStudentsFromExcel, exportStudentsToExcel, getAllStudents, getStudentByNationalCode, getDecisionsByNationalCode, report, sendOTP, checkOTP, login, currentStudent } = require('../controllers/student.controller');
const { authMiddleware, authMiddlewareStudent } = require('../middleware/auth.middleware'); // Assuming you will create authMiddlewareStudent similar to authMiddlewareTeacher

router.post('/', uploadImage.single('portrait'), authMiddleware, createStudent);
router.get('/', authMiddleware, getAllStudents);
router.get('/:national_code', authMiddleware, getStudentByNationalCode);
router.get('/evaluation/:nationalCode', authMiddleware, getDecisionsByNationalCode);
router.post('/import', uploadExcel.single('file'), authMiddleware, importStudentsFromExcel);
router.get('/export', authMiddleware, exportStudentsToExcel);

router.post('/report', authMiddleware, report);

router.post('/send-otp', sendOTP);
router.post('/check-otp', checkOTP);
router.post('/login', login);
router.get('/me', authMiddlewareStudent, currentStudent);

module.exports = router;