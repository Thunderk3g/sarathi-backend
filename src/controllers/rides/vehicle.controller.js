const mongoose = require('mongoose');
const Vehicle = require('../../models/rider/vehicle.model'); // Replace with the actual path to your Vehicle model
const asyncHandler = require('../../middlewares/asyncHandler');
const CustomError = require('../../utils/CustomError');

// Register a new vehicle
exports.register = asyncHandler(async (req, res, next) => {
    const { make, model, color, licensePlate, year } = req.body;

    // Check if the vehicle with the same license plate already exists
    const existingVehicle = await Vehicle.findOne({ licensePlate });

    if (existingVehicle) {
        return next(new CustomError(400, 'Vehicle with this license plate already exists.'));
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({
        make,
        model,
        color,
        licensePlate,
        year,
    });

    // Save the new vehicle to the database
    await newVehicle.save();

    res.status(201).json({ message: 'Vehicle registered successfully', vehicle: newVehicle });
});
