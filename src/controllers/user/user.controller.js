const bcrypt = require('bcrypt');
const User = require('../../models/user/user.model');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verified: false, // Set verified to false by default
            createdAt: new Date(),
            updatedAt: new Date(),
            // You can set other properties here as needed
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
        const { email, password } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ email });

        // If the email is not found, return an error
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is invalid, return an error
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create and sign a JSON Web Token (JWT)
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                // You can include additional data in the token payload as needed
            },
            process.env.JWT_SECRET, // Replace with your own secret key
            { expiresIn: '1h' } // Set the token expiration time as needed
        );

        // Respond with the token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = async (req, res) => {
    // Implement logout logic, possibly by invalidating the token
};

exports.updateProfile = async (req, res) => {
    // Implement profile update logic
};

// Add other necessary controllers for user management
