const express = require('express');
const router = express.Router();
const rideController = require("../../controllers/rides/ride.controller");

// In your ride.route.js
router.post('/requestRide', rideController.requestRide);
router.post('/findRiders', rideController.matchRide);
module.exports = router;
