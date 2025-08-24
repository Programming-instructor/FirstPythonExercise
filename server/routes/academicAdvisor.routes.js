const express = require('express');
const router = express.Router();
const academicAdvisorController = require('../controllers/academicAdvisor.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authMiddleware, academicAdvisorController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authMiddleware, academicAdvisorController.submitForm);

module.exports = router;