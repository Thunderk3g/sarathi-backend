const express = require('express');
const router = express.Router();

// Import sub-routes
const userRoutes = require('./user/user.route');

// Use sub-routes
router.use('/users', userRoutes);

// Export the base router
module.exports = router;
