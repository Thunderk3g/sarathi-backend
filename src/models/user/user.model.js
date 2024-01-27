const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        profilePicUrl: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // allows null
            trim: true,
            select: false,
        },
        password: {
            type: String,
            select: false,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            required: true,
            select: false,
        },
        updatedAt: {
            type: Date,
            required: true,
            select: false,
        },
    }
);

module.exports = mongoose.model('User', userSchema);
