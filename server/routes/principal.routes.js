const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principal.controller');
const authenticate = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authenticate, principalController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authenticate, principalController.submitForm);

module.exports = router;