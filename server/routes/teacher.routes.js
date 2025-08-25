const express = require('express');
const { addTeacher } = require('../controllers/teacher.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, addTeacher);

module.exports = router;