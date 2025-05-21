const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowStatusSchema = new mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cow' },
    state: { type: String, enum: ['Feeding', 'Lying', 'Standing'], required: true },
    recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CowStatus', CowStatusSchema);