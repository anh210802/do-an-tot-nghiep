const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    idCow: { type: String, required: true, unique: true },
    nameCow: { type: String, required: true },
    breedCow: String,
    birthDateCow: Date,
    weightCow: Number,
    genderCow: { type: String, enum: ['M', 'F', ''] },
    statusCow: String,
    haveDevice: { type: Boolean, default: false },
    deviceId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cow', CowSchema);
