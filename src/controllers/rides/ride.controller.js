const Ride = require('../../models/rides/riderequest.model');
const Driver = require('../../models/rider/driver.model');
// Include other necessary models and libraries
const User = require('../../models/user/user.model'); // Assuming this is the path to your User model
const RideRequest = require('../../models/rides/riderequest.model');
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

            const newRide = new Ride({
                user: userId,
                pickupLocation: {
                    type: 'Point',
                    coordinates: [pickupLocation.coordinates[0], pickupLocation.coordinates[1]] // Longitude, Latitude
                },
                dropoffLocation: {
                    type: 'Point',
                    coordinates: [dropoffLocation.coordinates[0], dropoffLocation.coordinates[1]] // Longitude, Latitude
                },
                requestTime,
                startTime,
                endTime,
                status: status || 'requested',
                fare,
                preferences
            });

            await newRide.save();
            res.status(201).json(newRide);
        } catch (error) {
            console.error('Error requesting ride:', error);
            res.status(500).json({ message: 'Error requesting ride' });
        }
    },



    // Other ride-related methods can be added here
    matchRide: async (req, res) => {
        try {
            const { driverId, location } = req.body; // Assuming driver's ID and location are passed in the request body

            // Verify the driver's existence in the database
            const driverExists = await Driver.exists({ _id: driverId });
            if (!driverExists) {
                return res.status(404).json({ message: 'Driver not found' });
            }

            // Find nearby ride requests based on the driver's location
            const nearbyRideRequests = await findNearbyRideRequests(location);

            res.status(200).json(nearbyRideRequests);
        } catch (error) {
            console.error('Error in finding nearby ride requests:', error);
            res.status(500).json({ message: 'Error in finding nearby ride requests' });
        }
    }
};



async function findNearbyRideRequests(driverLocation) {
    const maxDistance = 5000; // Maximum distance in meters
    return await RideRequest.find({
        pickupLocation: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [driverLocation.longitude, driverLocation.latitude]
                },
                $maxDistance: maxDistance
            }
        },
        status: 'requested'
    });
}
function filterDriversBasedOnPreferences(drivers, preferences) {
    // Implement logic to filter or sort drivers based on preferences
    return drivers; // Placeholder, refine as needed
}

function filterDriversBasedOnPreferences(drivers, preferences) {
    // Filter or sort drivers based on user preferences and driver ratings
    return drivers; // Placeholder, implement your logic
}

function notifyDriver(driver, rideRequest) {
    // Implement notification logic here, e.g., push notifications or WebSocket messages
}

module.exports = rideController;
