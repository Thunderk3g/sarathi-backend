const redis = require('redis');
const twilio = require('twilio');
const dotenv = require('dotenv');
const CustomError = require('../../../utils/customError'); // Adjust the path as necessary

// Load environment variables from .env file
dotenv.config();

// Configure Redis client for newer versions
const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});
redisClient.connect().catch(err => console.error('Redis connection error:', err));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Configure Twilio client for SMS sending
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (phoneNumber, otp) => {
    return redisClient.set(phoneNumber, otp, 'EX', 180);
};

const sendOTP = async (phone, otp) => {
    const phoneNumber = phone;
    console.log("Lauda");
    try {
        await twilioClient.messages.create({
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `Your OTP is: ${otp}`
        });
        return { success: true, otp: otp };
    } catch (error) {
        console.error('Error sending OTP via Twilio:', error);
        return { success: false, error: error.message };
    }
};

const verifyOTP = (phoneNumber, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const redisOTP = await redisClient.get(phoneNumber);
            resolve(otp === redisOTP);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    generateOTP,
    storeOTP,
    sendOTP,
    verifyOTP
};
