const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    status: String,
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Liên kết với tài khoản
});

module.exports = mongoose.model('Invoice', InvoiceSchema);