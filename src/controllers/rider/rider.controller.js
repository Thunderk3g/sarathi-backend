const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Rider = require('../../models/rider/rider.model');
const otpController = require('../thirdparty/otp-handler/otp-handler');
const asyncHandler = require('../../middlewares/asyncHandler');
const CustomError = require('../../utils/CustomError');
const db = require("../../models/index.model");
const Role = db.role;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Register rider
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, roles, createdAt, updatedAt } = req.body;
    const existingRider = await Rider.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingRider) {
        throw new CustomError(400, 'Email or phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rider = new Rider({ name, email, password: hashedPassword, phoneNumber, verified: false, createdAt, updatedAt });

    if (roles) {
        const assignedRoles = await Role.find({ name: { $in: roles } });
        rider.roles = assignedRoles.map(role => role._id);
    } else {
        const defaultRole = await Role.findOne({ name: 'rider' }); // Set the default role to "rider"
        rider.roles = [defaultRole._id];
    }

    await rider.save();

    res.status(201).send({ message: 'Rider was registered successfully!' });
});

// Login rider
exports.login = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    const rider = await Rider.findOne({ phoneNumber }).exec();
    if (!rider) {
        throw CustomError(401, 'Invalid phone number');
    } else {
        const otp = otpController.generateOTP();
        await otpController.storeOTP(phoneNumber, otp);
        await otpController.sendOTP(phoneNumber, otp);
        res.status(200).send('OTP sent successfully');
    }
});

// Validate OTP for rider login
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
