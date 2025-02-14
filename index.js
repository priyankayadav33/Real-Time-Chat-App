const express = require('express');
const http = require('http'); // For Socket.io
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import your auth routes
const messageRoutes = require('./routes/messageRoutes'); // Import your message routes
const Message = require('./models/Message'); // Import your Message model
const User = require('./models/User'); // Import your User model
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // or your deployed frontend URL
        methods: ["GET", "POST"]
    }
}); // Initialize Socket.io

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing JSON request bodies

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api', authRoutes); // Use your auth routes for /api/register, /api/login
app.use('/api', messageRoutes); // Use your message routes for /api/messages, etc.

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_room', (room) => {
        socket.join(room); // Join the socket to the room
    });

    socket.on('send_message', async (message) => {
        try {
            // 1. Emit the message to all clients in the room
            io.to(message.room).emit('message', message);

            // 2. Save the message to the database (if needed)
            const newMessage = new Message(message);
            await newMessage.save();

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});