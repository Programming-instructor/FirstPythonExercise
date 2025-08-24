const express = require('express');
const router = express.Router();
const psychCounselorController = require('../controllers/psychCounselor.controller');
const authenticate = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authenticate, psychCounselorController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authenticate, psychCounselorController.submitForm);

module.exports = router;