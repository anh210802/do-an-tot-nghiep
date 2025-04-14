const mongoose = require('mongoose');
const Device = require('../models/deviceModel');
const Cow = require('../models/cowModel');
const mqttService = require('../service/mqttService');

const setDeviceController = {
    setDevice: async (req, res) => {
        try {
            const { cowId, deviceType, serialNumber } = req.body;
            const cow = await Cow.findOne({ idCow: cowId });
            if (!cow) {
                return res.status(404).json({ message: 'Không tìm thấy động vật' });
            }
            const newDevice = await Device.create({
                cowId: cow._id,
                deviceType,
                serialNumber,
                status: 'connect'
            });
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },
}