const redis = require('redis');
const twilio = require('twilio');

// Configure Redis client for newer versions
const redisClient = redis.createClient({
    password: '8DsnCuLNl7Izrsui5eY3MOywDIc5tsSi', // Use environment variable or secure method to store password
    socket: {
        host: 'redis-10947.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 10947
    }
});
redisClient.connect();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Configure Twilio client for SMS sending
const twilioClient = twilio('ACedf68f1ef221f3aeb6e6bf584eebb8e3', 'c44e75a541148a28980fca8db829c538'); // Use environment variable or secure method to store credentials

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (phoneNumber, otp) => {
    return redisClient.setEx(phoneNumber, 300, otp); // Corrected the client variable name
};

const sendOTP = async (otp, phone) => {
    const phoneNumber = phone;
    try {
        twilioClient.messages.create({
            to: phoneNumber,
            from: '+14199623006', // Replace with your Twilio phone number
            body: `Your OTP is: ${otp}`
        });
        return { success: true, otp: otp }; // Return success status and OTP
    } catch (error) {
        console.error('Error sending OTP via Twilio:', error);
        return { success: false, error: error.message }; // Return error information
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
