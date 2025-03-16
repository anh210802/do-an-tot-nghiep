const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");

const authController = {
    // Register a new user
    registerUser: async (req, res) => {
        try {
            const { name, username, password, email, phone} = req.body;
    
            const existingUser = await User.findOne({ $or: [{ username }] });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const key = uuidv4();
    
            const user = await User.create({
                name,
                username,
                password: hashedPassword,
                email,
                phone,
                key,
            });
    
            return res.json({ message: 'User created successfully', user });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    // Login an existing user
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                console.log("User not found");
                return res.status(400).json({ message: "Invalid credentials" });
            }
    
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                console.log("Invalid password");
                return res.status(400).json({ message: "Invalid credentials" });
            }
    
            req.session.user = { id: user._id, username: user.username };
            
            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    key: user.key, 
                },
                redirectUrl: "/user/${user._id}",
            });
    
        } catch (error) {
            console.error("Login error:", error.message || error);
            return res.status(500).json({ 
                message: "Error logging in", 
                error: error.message || error 
            });
        }
    },
    // Logout the current user
    logoutUser: (req, res) => {
        if (!req.session.user) {
            return res.status(400).json({ message: "No user is logged in" });
        }
    
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            res.clearCookie('connect.sid'); 
            res.status(200).json({ message: "Logged out successfully" });
        });
    },
};

module.exports = authController;