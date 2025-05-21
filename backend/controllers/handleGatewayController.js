const User = require("../models/userModel");

const handleGatewayController = {
    setGateway: async (req, res) => {
        try {
            const { gatewayId } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).json({ message: "Không tìm thấy người dùng" });
            }

            // Kiểm tra xem gatewayId đã được gán cho user nào chưa
            const exists = await User.findOne({ gateways: gatewayId });
            if (exists) {
                return res.status(400).json({ message: "Gateway ID đã được sử dụng" });
            }

            if (!user.gateways.includes(gatewayId)) {
                user.gateways.push(gatewayId);
                await user.save();
            }

            return res.status(200).json({ message: "Gán Gateway thành công", gateways: user.gateways });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    },

    getAllGateway: async (req, res) => {
        try {
            const userId = req.user._id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            return res.status(200).json({ message: "Lấy danh sách Gateway thành công", gateways: user.gateways });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    },

    deleteGateway: async (req, res) => {
        try {
            const { gatewayId } = req.body;
            const userId = req.user._id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            user.gateways = user.gateways.filter(id => id !== gatewayId);
            await user.save();

            return res.status(200).json({ message: "Xóa Gateway thành công", gateways: user.gateways });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    },
};

module.exports = handleGatewayController;
