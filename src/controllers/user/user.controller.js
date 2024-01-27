const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('../../models/user/user.model');
const otpController = require('../otp-handler/otp-handler'); // Correct the path as needed

exports.register = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phoneNumber = req.body.phoneNumber;

        // Check if the email or phone number is already registered
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or phone number is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            verified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save the user to the database
        await newUser.save();

        // Omit the password when returning the user object
        newUser.password = undefined;

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Check if the phone number exists in the database
        const user = await User.findOne({ phoneNumber }).exec();

        // If the phone number is not found, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid phone number' });
        }

        // Generate and send OTP
        const otp = otpController.generateOTP();
        otpController.storeOTP(otp, phoneNumber);
        otpController.sendOTP(otp, phoneNumber); // Assuming sendOTP handles both email and phone

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.validateOtp = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const otp = req.body.otp;

        const isValid = await otpController.verifyOTP(phoneNumber, otp);

        if (isValid) {
            // Logic for successful OTP validation
            // This could include generating a JWT or updating user status
            res.status(200).json({ message: 'OTP validated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error during OTP validation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.logout = async (req, res) => {
    // Implement logout logic, possibly by invalidating the token or removing it from the client
};

exports.updateProfile = async (req, res) => {
    // Implement profile update logic
};




// Add other necessary controllers for user management
