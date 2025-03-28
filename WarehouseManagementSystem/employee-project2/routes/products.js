const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User'); // Import model User

const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin');

// Middleware kiểm tra đăng nhập
function checkAuth(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

// ✅ Admin xem tất cả sản phẩm
router.get('/all', checkAdmin, async(req, res) => {
    try {
        const products = await Product.find().populate('userId', 'name email'); // Lấy thông tin user nhập hàng
        res.render('adminProducts', { products });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Trang chính (hiển thị sản phẩm của user đăng nhập)
router.get('/', checkAuth, async(req, res) => {
    try {
        const products = await Product.find({ userId: req.session.user._id });
        res.render('index', { products });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Trang thêm sản phẩm
router.get('/add', checkAuth, (req, res) => {
    res.render('add');
});

// ✅ Xử lý thêm sản phẩm (chỉ giữ một route POST /add)
router.post('/add', checkAuth, async(req, res) => {
    try {
        const { name, code, status, manufacturer, quantity } = req.body;
        await Product.create({
            name,
            code,
            status,
            manufacturer,
            quantity,
            userId: req.session.user._id
        });
        res.redirect('/');
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Hiển thị form chỉnh sửa sản phẩm
router.get('/edit/:id', checkAuth, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Sản phẩm không tồn tại!");
        res.render('edit', { product });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm để chỉnh sửa:", error);
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Xử lý cập nhật sản phẩm
router.post('/edit/:id', checkAuth, async(req, res) => {
    try {
        const { name, code, status, manufacturer, quantity } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, code, status, manufacturer, quantity });
        res.redirect('/');
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Xóa sản phẩm
router.post('/delete/:id', checkAuth, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});

module.exports = router;