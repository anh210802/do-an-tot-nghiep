const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cow' },
    deviceID: { type: String, unique: true, required: true },
    status: { type: String, enum: ['connect', 'disconnect'] },
    battery: { type: Number, default: 100 },
    installedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);