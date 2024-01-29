const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pickupLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    dropoffLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'completed', 'canceled'],
        default: 'requested',
    },
    preferences: {
        // Add preferences fields as required
    },
    fare: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Geospatial index for the pickupLocation
rideRequestSchema.index({ 'pickupLocation': '2dsphere' });
// Optionally, you can also index dropoffLocation if needed

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = RideRequest;
