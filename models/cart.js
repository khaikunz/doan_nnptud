const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{ productId: { type: String}, quantity: Number }],
    total: { type: Number, required: true },
    isDeleted: {type:Boolean,default:false}
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);