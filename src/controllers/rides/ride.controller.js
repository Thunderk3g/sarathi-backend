const Ride = require('../../models/rides/riderequest.model');
const Driver = require('../../models/rider/driver.model');
// Include other necessary models and libraries
const User = require('../../models/user/user.model'); // Assuming this is the path to your User model
const rideController = {
    requestRide: async (req, res) => {
        try {
            const {
                user: userId,
                pickupLocation,
                dropoffLocation,
                requestTime,
                startTime,
                endTime,
                status,
                fare,
                preferences
            } = req.body;

            // Check if user exists
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }


            // TODO: Add additional input validation here

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
                requestTime,
                startTime,
                endTime,
                status: status || 'requested',
                fare,
                preferences
            });

            await newRide.save();

            // TODO: Implement matchRideWithDrivers function
            // await matchRideWithDrivers(newRide);

            res.status(201).json(newRide);
        } catch (error) {
            console.error('Error requesting ride:', error);
            res.status(500).json({ message: 'Error requesting ride' });
        }
    }


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
