const redis = require('redis');

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