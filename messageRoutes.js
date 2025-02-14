const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // Your auth middleware
const Message = require('../models/Message');

router.get('/messages/:room', authenticate, async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room }).populate('sender', 'username'); // Populate sender info
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ... other message routes (e.g., POST /messages)

module.exports = router;
