const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    uploadDate: { type: Date, default: Date.now },
    isDeleted: {type:Boolean,default:false}
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);