const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.controller');

// Define user-related routes
router.post('/register', userController.register);
router.post('/login', userController.login);
// ... and other user routes
router.post('/validate-otp', userController.validateOtp); // New route for OTP validation

module.exports = router;
