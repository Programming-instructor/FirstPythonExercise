const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principal.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authMiddleware, principalController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authMiddleware, principalController.submitForm);

module.exports = router;