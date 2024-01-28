const Ride = require('../../models/rides/rides.model');
const Driver = require('../../models/rider/driver.model');
// Include other necessary models and libraries

const rideController = {
    requestRide: async (req, res) => {
        try {
            const { userId, pickupLocation, dropoffLocation, preferences } = req.body;

            // TODO: Add input validation here

            const newRide = new Ride({
                user: userId,
                pickupLocation: {
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude
                },
                dropoffLocation: {
                    latitude: dropoffLocation.latitude,
                    longitude: dropoffLocation.longitude
                },
                // requestTime is automatically set by default to Date.now
                status: 'requested',
                // Include other fields like fare, preferences, etc., as per your schema
            });

            await newRide.save();

            // Call the function to match the ride with available drivers
            await matchRideWithDrivers(newRide);

            res.status(201).json(newRide);
        } catch (error) {
            console.error('Error requesting ride:', error);
            res.status(500).json({ message: 'Error requesting ride' });
        }
    },

    // Other ride-related methods can be added here
};

async function matchRideWithDrivers(rideRequest) {
    try {
        const nearbyDrivers = await findNearbyAvailableDrivers(rideRequest.pickupLocation);
        const suitableDrivers = filterDriversBasedOnPreferences(nearbyDrivers, rideRequest.preferences);

        for (const driver of suitableDrivers) {
            notifyDriver(driver, rideRequest);
        }
    } catch (error) {
        console.error('Error in matching ride with drivers:', error);
        // Handle error appropriately
    }
}

async function findNearbyAvailableDrivers(pickupLocation) {
    const maxDistance = 5000; // Maximum distance in meters
    return await Driver.find({
        status: 'available',
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [pickupLocation.longitude, pickupLocation.latitude]
                },
                $maxDistance: maxDistance
            }
        }
    });
}

function filterDriversBasedOnPreferences(drivers, preferences) {
    // Filter or sort drivers based on user preferences and driver ratings
    return drivers; // Placeholder, implement your logic
}

function notifyDriver(driver, rideRequest) {
    // Implement notification logic here, e.g., push notifications or WebSocket messages
}

module.exports = rideController;
