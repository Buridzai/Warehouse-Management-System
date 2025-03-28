const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.send('Tài khoản đã tồn tại!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role: 'user' });
    res.redirect('/login');
});

// Đăng nhập
router.get('/login', (req, res) => res.render('login'));
router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { _id: user._id, username: user.username, role: user.role };
        return res.redirect('/');
    }
    res.send('Đăng nhập thất bại! Kiểm tra lại tài khoản và mật khẩu.');
});

// Đăng xuất
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;