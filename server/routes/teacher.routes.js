const express = require('express');
const { addTeacher, getAllTeachers } = require('../controllers/teacher.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, addTeacher);
router.get('/', getAllTeachers); // full route: /api/teachers


module.exports = router;