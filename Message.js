const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // The name of the model to reference
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Set the default value to the current time
    },
    room: {  // Add a room field for group chats
        type: String,
        required: true,
        default: 'general' // Or any default room name
    }
}, { timestamps: true }); // Add timestamps for message creation/updates

module.exports = mongoose.model('Message', messageSchema);