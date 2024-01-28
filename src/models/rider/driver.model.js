const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    licenseNumber: String,
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    status: { type: String, enum: ['available', 'on-trip', 'offline'] },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
});

// Geospatial index for location
riderSchema.index({ location: '2dsphere' });

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;
