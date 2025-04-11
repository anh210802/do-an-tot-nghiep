const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nameCow: { type: String, required: true },
    breedCow: String,
    birthDateCow: Date,
    weightCow: Number,
    genderCow: { type: String, enum: ['M', 'F', ''] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cow', CowSchema);
