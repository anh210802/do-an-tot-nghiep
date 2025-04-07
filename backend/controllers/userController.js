const mongoose = require('mongoose');
const User = require('../models/userModel');

const userController = {
    getUser: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
};

module.exports = userController;
