const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    code: String,
    status: String,
    manufacturer: String,
    quantity: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Liên kết với User
});

module.exports = mongoose.model('Product', productSchema);