const express = require('express');
const router = express.Router();
const educationalDeputyController = require('../controllers/educationalDeputy.controller');
const authenticate = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authenticate, educationalDeputyController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authenticate, educationalDeputyController.submitForm);

module.exports = router;