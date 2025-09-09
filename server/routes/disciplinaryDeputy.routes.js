const express = require('express');
const router = express.Router();
const disciplinaryDeputyController = require('../controllers/disciplinaryDeputy.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET form for a student
router.get('/:studentId', authMiddleware, disciplinaryDeputyController.getFormForStudent);

// POST submit form for a student
router.post('/:studentId/submit', authMiddleware, disciplinaryDeputyController.submitForm);

module.exports = router;