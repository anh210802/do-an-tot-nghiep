const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');
const router = require('express').Router();
const rateLimit = require("express-rate-limit");

// Limit login requests form the same IP to 10 requests per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10, // Tăng giới hạn lên 10 lần
    message: { message: "Too many login attempts, please try again later" },
});

// Register
router.post("/register", authController.registerUser);

// Login
router.post("/login", loginLimiter, authController.loginUser);

// Request refresh token
router.post("/refresh-token", middlewareController.verifyToken, authController.requestRefreshToken);

// Logout
router.post("/logout", middlewareController.verifyToken, authController.logoutUser);

module.exports = router;
