const authController = require('../controllers/authController');
const router = require('express').Router();
const rateLimit = require("express-rate-limit");

// Limit login requests form the same IP to 5 requests per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: "Too many login attempts, please try again later" },
});

// Register
router.post("/register", authController.registerUser);

// Login
router.post("/login", loginLimiter, authController.loginUser);

// Logout
router.delete("/logout", authController.logoutUser);  

module.exports = router;
