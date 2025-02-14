const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // 3. Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' }); // Send success message
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // User not found
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Customize expiry

        res.json({ token }); // Send token to the client
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;