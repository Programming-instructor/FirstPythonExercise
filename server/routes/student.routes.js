const express = require('express');
const router = express.Router();
const { uploadImage, uploadExcel, createStudent, importStudentsFromExcel, exportStudentsToExcel, getAllStudents, getStudentByNationalCode, getDecisionsByNationalCode } = require('../controllers/student.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/', uploadImage.single('portrait'), authMiddleware, createStudent);
router.get('/', authMiddleware, getAllStudents);
router.get('/:national_code', authMiddleware, getStudentByNationalCode);
router.get('/evaluation/:nationalCode', authMiddleware, getDecisionsByNationalCode);
router.post('/import', uploadExcel.single('file'), authMiddleware, importStudentsFromExcel);
router.get('/export', authMiddleware, exportStudentsToExcel);

module.exports = router;