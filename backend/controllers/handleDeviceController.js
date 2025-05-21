const mongoose = require('mongoose');
const Device = require('../models/deviceModel');
const Cow = require('../models/cowModel');
const tcp = require('../service/tcpService');
const User = require('../models/userModel');

const tcpService = require('../service/tcpService');

const setDeviceController = {
    setDevice: async (req, res) => {
        try {
            const { cowId, deviceID } = req.body;
            const userId = req.user.id;
        
            const user = await User.findById(userId);
            const gateways = user.gateways;
        
            if (!gateways || gateways.length === 0) {
                return res.status(400).json({ message: 'Người dùng chưa có gateway nào' });
            }
        
            const cow = await Cow.findOne({ idCow: cowId });
            if (!cow) {
                return res.status(401).json({ message: 'Không tìm thấy động vật' });
            }
        
            if (cow.deviceId === deviceID) {
                return res.status(400).json({ message: 'Thiết bị đã được sử dụng' });
            }
        
            tcp.sendDeviceId(gateways, deviceID, cowId);
        
            return res.status(200).json(deviceID);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    deleteDevice: async (req, res) => {
        try {
            const { cowId } = req.body;
            const cow = await Cow.findOne({ idCow: cowId });
            if (!cow) {
                return res.status(401).json({ message: 'Không tìm thấy động vật' });
            }

            if (!cow.haveDevice) {
                return res.status(400).json({ message: 'Động vật không có thiết bị' });
            }

            await Device.deleteOne({ cowId: cow._id });
            cow.deviceId = null;
            cow.haveDevice = false;
            await cow.save();

            return res.status(200).json({ message: 'Gỡ thiết bị thành công' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }
};

module.exports = setDeviceController;
