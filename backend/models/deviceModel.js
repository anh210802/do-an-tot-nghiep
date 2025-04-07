const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cow' },
    deviceType: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'] },
    installedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);