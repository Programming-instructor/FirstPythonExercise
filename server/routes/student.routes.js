const express = require('express');
const router = express.Router();
const { uploadImage, uploadExcel, createStudent, importStudentsFromExcel, exportStudentsToExcel, getAllStudents, getStudentByNationalCode, getDecisionsByNationalCode, report, sendOTP, checkOTP, login, currentStudent, getReports, getStudentAttendance, editReport, confirmReport, getConfirmedReportsByNationalCode, getAllUnconfirmedReports, deleteStudent, updateStudent, getStudentById } = require('../controllers/student.controller');
const { authMiddleware, authMiddlewareStudent, authMiddlewareTeacherAndAdmin } = require('../middleware/auth.middleware'); // Assuming you will create authMiddlewareStudent similar to authMiddlewareTeacher

router.post('/', uploadImage.single('portrait'), authMiddleware, createStudent);
router.get('/', authMiddleware, getAllStudents);
router.get('/by-id/:id', authMiddleware, getStudentById);
router.patch('/:id', uploadImage.single('portrait'), authMiddleware, updateStudent);
router.delete('/:id', authMiddleware, deleteStudent);
router.get('/evaluation/:nationalCode', authMiddleware, getDecisionsByNationalCode);
router.post('/import', uploadExcel.single('file'), authMiddleware, importStudentsFromExcel);
router.get('/export', authMiddleware, exportStudentsToExcel);

router.post('/report', authMiddleware, report); // /api/student/report
router.get('/reports/:ncode', authMiddlewareTeacherAndAdmin, getReports);
router.patch('/report/:reportId/confirm', authMiddleware, confirmReport);
router.patch('/report/:reportId', authMiddleware, editReport);
router.get('/confirmed-reports/:nationalCode', getConfirmedReportsByNationalCode);

router.get('/unconfirmed-reports', authMiddleware, getAllUnconfirmedReports);

router.get('/attendance/:national_code', getStudentAttendance);

router.post('/send-otp', sendOTP);
router.post('/check-otp', checkOTP);
router.post('/login', login);
router.get('/me', authMiddlewareStudent, currentStudent);

router.get('/:national_code', authMiddleware, getStudentByNationalCode);

module.exports = router;