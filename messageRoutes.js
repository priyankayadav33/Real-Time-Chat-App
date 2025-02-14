const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // Your authentication middleware
const Message = require('../models/Message'); // Import your Message model

// Get messages for a room (protected route)
router.get('/messages/:room', authenticate, async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .populate('sender', 'username') // Populate sender's username
            .sort({ timestamp: 1 }); // Sort messages by timestamp (ascending)

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


// Save a new message (protected route)
router.post('/messages', authenticate, async (req, res) => {
    try {
        const { content, room } = req.body;
        const newMessage = new Message({
            content,
            sender: req.user.userId, // Use the user ID from the JWT (req.user)
            room
        });

        const savedMessage = await newMessage.save();

        // Populate the sender information for the response
        const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'username');

        res.status(201).json(populatedMessage); // Send the populated message back
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});


module.exports = router;