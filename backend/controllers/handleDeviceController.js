const mongoose = require('mongoose');
const Device = require('../models/deviceModel');
const Cow = require('../models/cowModel');

const setDeviceController = {
    setDevice: async (req, res) => {
        try {
            const { cowId, deviceID } = req.body;
            const cow = await Cow.findOne({ idCow: cowId });
            if (!cow) {
                return res.status(404).json({ message: 'Không tìm thấy động vật' });
            }
            if (cow.deviceId === deviceID) {
                return res.status(400).json({ message: 'Thiết bị đã được sử dụng' });
            }
            const newDevice = await Device.create({
                cowId: cow._id,
                deviceID,
                status: 'disconnect',
            });

            cow.deviceId = deviceID;
            cow.haveDevice = true;
            await cow.save();
            
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
                return res.status(404).json({ message: 'Không tìm thấy động vật' });
            }
            if (!cow.haveDevice) {
                return res.status(400).json({ message: 'Động vật không có thiết bị' });
            }
            await Device.deleteOne({ cowId: cow._id });
            cow.deviceId = null;
            cow.haveDevice = false;
            await cow.save();
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = setDeviceController;