const express = require('express');
const router = express.Router();
const riderController = require("../../controllers/rider/rider.controller");
const vehicleController = require("../../controllers/rides/vehicle.controller")
// Rider registration routes
router.post('/register', riderController.register);
router.post('/login', riderController.login);
router.post('/validate-otp', riderController.validateOtp);
router.post('/register-vehicle', vehicleController.register)
module.exports = router;
