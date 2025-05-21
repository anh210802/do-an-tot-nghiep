const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');

let refreshTokens = [];
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
    
            return res.status(200).json({ message: 'User created successfully', user });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            { 
                id: user._id, 
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
    },
    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '365d' }
        );
    },
    // Login an existing user
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
    
            if (!username || !password) {
                console.log("Missing username or password");
                return res.status(400).json({ message: "Username and password are required" });
            }
    
            const user = await User.findOne({ username });
            if (!user) {
                console.log(`User not found: ${username}`);
                return res.status(401).json({ message: "Tài khoản không tồn tại!" });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                console.log(`Invalid password for user: ${username}`);
                return res.status(402).json({ message: "Mật khẩu sai!" });
            }
    
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 365 * 24 * 60 * 60 * 1000, 
                });
                const { password, ...others } = user._doc;
                return res.status(200).json({
                    message: "Đăng nhập thành công!",
                    user: others,
                    accessToken,
                    refreshToken,
                });
            }
        } catch (error) {
            console.error("Login error:", error.message || error);
            return res.status(500).json({ 
                message: "Error logging in", 
                error: error.message || error 
            });
        }
    },
    // refresh token
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: "Refresh token is invalid" });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                console.error("Invalid refresh token:", err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 365 * 24 * 60 * 60 * 1000, 
        });
        return res.status(200).json({
            message: "Refresh token generated successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    },
    // Logout the current user
    logoutUser: (req, res) => {
        try {
            // Check if the request has a refresh token
            const refreshToken = req.cookies.refreshToken;  // Get refresh token from cookies
            
            if (!refreshToken) {
                return res.status(400).json({ message: "No refresh token provided" });
            }
    
            // Remove the refresh token from the refreshTokens array
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    
            // Clear the refreshToken cookie
            res.clearCookie("refreshToken");
    
            return res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Logout error:", error.message || error);
            return res.status(500).json({
                message: "Error logging out",
                error: error.message || error
            });
        }
    },
    
};

module.exports = authController;