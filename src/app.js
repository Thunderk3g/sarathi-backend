const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index.route');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(
    express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);

// Define the allowed origins (replace with your specific origins)


app.use(cors({
    optionsSuccessStatus: 200,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a base landing response for the root route ("/")
app.get('/', (req, res) => {
    res.send('Welcome to Sarathi');
});

app.use('/api', indexRoute);

// Define other middlewares and routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
