const express = require('express');
const router = express.Router();
const academicAdvisorController = require('../controllers/academicAdvisor.controller');
const authenticate = require('../middleware/auth.middleware')

// GET form for a student
router.get('/:studentId', authenticate, academicAdvisorController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authenticate, academicAdvisorController.submitForm);

module.exports = router;