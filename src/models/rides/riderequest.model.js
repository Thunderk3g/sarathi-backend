const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with the actual reference model name for the user
        required: true,
    },
    pickupLocation: {
        latitude: Number,
        longitude: Number,
    },
    dropoffLocation: {
        latitude: Number,
        longitude: Number,
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'completed', 'canceled'],
        default: 'requested',
    },
    preferences: {
        // Define any preferences fields you want to include
    },
    fare: {
        type: Number,
        required: true
    },
    // Add other fields as needed for your ride request schema
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the RideRequest model
const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = RideRequest;
