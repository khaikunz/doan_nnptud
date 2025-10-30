const mongoose = require('mongoose');
require('./auth.js');
const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    userId: { type: String, ref: 'Auth', required: true },
    products: [{ productId: { type: String, ref: 'Product' }, quantity: Number }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    orderDate: { type: Date, default: Date.now },
    isDeleted: {type:Boolean,default:false}

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);