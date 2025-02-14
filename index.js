const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message'); // Import Message model

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000", // Be explicit, or use an env variable
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Use cors middleware *before* other routes
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api', authRoutes);
app.use('/api', messageRoutes);


// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_room', (room) => {
        socket.join(room);
    });

    socket.on('send_message', async (message) => {
        try {
            // 1. Save the message to the database (important for persistence)
            const newMessage = new Message(message);
            const savedMessage = await newMessage.save();

            // 2. Populate sender info *before* emitting
            const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'username');

            // 3. Emit the populated message
            io.to(message.room).emit('message', populatedMessage);


        } catch (error) {
            console.error("Error saving/sending message:", error);
            // Handle error appropriately (e.g., emit an error event to the client)
            socket.emit('message_error', 'Failed to send message.'); // Example error event
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});