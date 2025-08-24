const express = require('express');
const router = express.Router();
const educationalDeputyController = require('../controllers/educationalDeputy.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authMiddleware, educationalDeputyController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authMiddleware, educationalDeputyController.submitForm);

module.exports = router;