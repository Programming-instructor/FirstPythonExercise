const express = require('express');
const router = express.Router();
const { upload, createStudent } = require('../controllers/student.controller');

router.post('/', upload.single('portrait'), createStudent);

module.exports = router;
