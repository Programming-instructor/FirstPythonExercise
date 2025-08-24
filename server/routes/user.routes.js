const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, userController.addUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.post('/login', userController.login);
router.post('/send-otp', userController.sendOTP);
router.post('/check-otp', userController.checkOTP);
router.get('/me', authMiddleware, userController.currentUser);

module.exports = router;