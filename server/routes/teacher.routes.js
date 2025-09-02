const express = require('express');
const { addTeacher, getAllTeachers, login, sendOTP, checkOTP, currentTeacher, getReports, addReportToTeacher } = require('../controllers/teacher.controller');
const { authMiddleware, authMiddlewareTeacher } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, addTeacher);
router.get('/', getAllTeachers); // full route: /api/teacher

router.get('/reports/:id', getReports);

router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/check-otp', checkOTP);
router.get('/me', authMiddlewareTeacher, currentTeacher);

router.post('/add-report', authMiddleware, addReportToTeacher); // full route: /api/teacher/add-report


module.exports = router;