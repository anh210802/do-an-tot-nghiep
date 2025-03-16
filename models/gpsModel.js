const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GPSDataSchema = new mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cow' },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GPSData', GPSDataSchema);