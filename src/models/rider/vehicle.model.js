const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    make: String,
    model: String,
    color: String,
    licensePlate: String,
    year: Number
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
