const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // Sử dụng username thay vì email
    password: String,
    role: { type: String, default: 'user' } // Admin sẽ có role là 'admin'
});

module.exports = mongoose.model('User', UserSchema);