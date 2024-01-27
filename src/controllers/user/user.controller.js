const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/user.model');
const otpController = require('../otp-handler/otp-handler');
const asyncHandler = require('../../middlewares/asyncHandler');
const CustomError = require('../../utils/CustomError');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Register user
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
        throw new CustomError(400, 'Email or phone number already registered');
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, phoneNumber, verified: false });
        newUser.password = undefined;
        res.status(201).json(newUser);
    }
});


// Login user
exports.login = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber }).exec();
    if (!user) {
        throw new CustomError(401, 'Invalid phone number');
    } else {
        const otp = otpController.generateOTP();
        await otpController.storeOTP(phoneNumber, otp);
        await otpController.sendOTP(phoneNumber, otp);
        res.status(200).send('OTP sent successfully');
    }
});


// Validate OTP
exports.validateOtp = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const isValid = await otpController.verifyOTP(phoneNumber, otp);
    if (isValid) {
        const { accessToken, expiresIn } = generateAccessToken(phoneNumber);
        res.status(200).json({ message: 'OTP validated successfully', accessToken, expiresIn });
    } else {
        throw new CustomError(401, 'Invalid OTP');
    }
});



// Generate Access Token
function generateAccessToken(phoneNumber) {
    const payload = { phoneNumber };
    const expiresIn = '1h';
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn });
    const expirationTimestamp = Math.floor(Date.now() / 1000) + jwt.decode(accessToken).exp;
    return { accessToken, expiresIn: expirationTimestamp };
}

// Logout and Update Profile (to be implemented)
