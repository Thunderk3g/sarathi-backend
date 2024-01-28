const express = require('express');
const router = express.Router();

// Import sub-routes
const userRoutes = require('./user/user.route');
const rideRoutes = require('./rides/ride.route');
const riderRoutes = require('./rider/rider.route');

// Use sub-routes
router.use('/users', userRoutes);
router.use('/rides', rideRoutes);
router.use('/rider', riderRoutes);


// Export the base router
module.exports = router;
