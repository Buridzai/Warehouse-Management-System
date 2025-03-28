const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Hiển thị danh sách sản phẩm
router.get('/', async(req, res) => {
    const items = await Item.find();
    res.render('index', { items });
});

// Hiển thị form thêm sản phẩm
router.get('/add', (req, res) => res.render('add'));

// Xử lý thêm sản phẩm
router.post('/add', async(req, res) => {
    try {
        await Item.create({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            status: req.body.status,
            manufacturer: req.body.manufacturer,
            productCode: req.body.productCode
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Lỗi khi thêm sản phẩm: ' + err.message);
    }
});

// Trang chỉnh sửa sản phẩm (hiển thị form)
router.get('/edit/:id', checkAuth, async(req, res) => {
    try {
        const product = await Item.findById(req.params.id);
        if (!product) return res.status(404).send("Sản phẩm không tồn tại!");
        res.render('edit', { product });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).send("Lỗi server!");
    }
});


// Xử lý cập nhật sản phẩm
router.post('/edit/:id', async(req, res) => {
    try {
        await Item.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            status: req.body.status,
            manufacturer: req.body.manufacturer,
            productCode: req.body.productCode
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Lỗi khi cập nhật sản phẩm: ' + err.message);
    }
});

// Xóa sản phẩm
router.post('/delete/:id', async(req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Lỗi khi xóa sản phẩm: ' + err.message);
    }
});




module.exports = router;