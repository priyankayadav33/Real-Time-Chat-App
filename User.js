const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true,   // Remove leading/trailing whitespace
        minlength: 3, // Minimum length for username
        maxlength: 20 // Maximum length for username
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    // Add other user fields as needed (e.g., email, profile picture, etc.)
    // email: {
    //     type: String,
    //     unique: true,
    //     trim: true,
    //     lowercase: true, // Store email in lowercase
    //     match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ // Basic email validation regex
    // },
    // profilePicture: {
    //     type: String // Store URL or path to the profile picture
    // }
}, { timestamps: true }); // Add timestamps for creation and update dates

module.exports = mongoose.model('User', userSchema);