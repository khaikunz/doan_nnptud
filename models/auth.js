const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isDeleted: {type:Boolean,default:false}

}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);