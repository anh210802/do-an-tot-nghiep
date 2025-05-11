const mongoose = require('mongoose');
const { getAllCows } = require('../controllers/handleCowController');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: false, required: false },
    phone: String,
    gateways: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema); 
