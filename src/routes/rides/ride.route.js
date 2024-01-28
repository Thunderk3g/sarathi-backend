const express = require('express');
const router = express.Router();
const rideController = require("../../controllers/rides/ride.controller");

// In your ride.route.js
router.post('/requestRide', rideController.requestRide);
module.exports = router;
