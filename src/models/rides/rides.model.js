const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    pickupLocation: locationSchema,
    dropoffLocation: locationSchema,
    requestTime: {
        type: Date,
        default: Date.now
    },
    startTime: Date,
    endTime: Date,
    status: {
        type: String,
        enum: ['requested', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'requested'
    },
    fare: Number
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
