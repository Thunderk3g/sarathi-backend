const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index.route');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config(); // This will load the environment variables from the .env file

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(
    express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ optionsSuccessStatus: 200 }));


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', indexRoute);
app.use(errorHandler);

// Define other middlewares and routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
