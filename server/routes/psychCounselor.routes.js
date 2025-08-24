const express = require('express');
const router = express.Router();
const psychCounselorController = require('../controllers/psychCounselor.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authMiddleware, psychCounselorController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authMiddleware, psychCounselorController.submitForm);

module.exports = router;