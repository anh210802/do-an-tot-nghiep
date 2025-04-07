const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BatteryLevelSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    batteryPercentage: { type: Number, min: 0, max: 100, required: true },
    recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BatteryLevel', BatteryLevelSchema);