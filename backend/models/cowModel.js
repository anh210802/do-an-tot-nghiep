const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    breed: String,
    birthDate: Date,
    weight: Number,
    gender: { type: String, enum: ['M', 'F'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cow', CowSchema);
