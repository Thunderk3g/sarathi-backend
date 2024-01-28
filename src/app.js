const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index.route');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config(); // This will load the environment variables from the .env file

const app = express();
const db = require("././models/index.model");
const Role = db.role;
app.use(express.json({ limit: '10mb' }));
app.use(
    express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ optionsSuccessStatus: 200 }));


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected');
        initial();
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', indexRoute);
app.use(errorHandler);

// Define other middlewares and routes
async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();

        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("added 'user' to roles collection");

            await new Role({ name: "rider" }).save();
            console.log("added 'rider' to roles collection");

            await new Role({ name: "admin" }).save();
            console.log("added 'admin' to roles collection");
        }
    } catch (err) {
        console.error("error", err);
    }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
