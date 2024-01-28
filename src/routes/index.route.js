const express = require('express');
const router = express.Router();

// Import sub-routes
const userRoutes = require('./user/user.route');
const rideRoutes = require('./rides/ride.route');

// Use sub-routes
router.use('/users', userRoutes);
router.use('/rides', rideRoutes);

// Export the base router
module.exports = router;
