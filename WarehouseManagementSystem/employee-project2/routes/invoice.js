const express = require('express');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice'); // Tạo model hóa đơn
const checkAdmin = require('../middleware/checkAdmin'); // Admin middleware
const checkUser = require('../middleware/checkUser'); // Kiểm tra user middleware

const router = express.Router();

// Trang xuất hóa đơn
router.get('/create', async(req, res) => {
    try {
        const products = await Product.find();
        res.render('invoice', { products });
    } catch (error) {
        console.error("Lỗi khi tải trang xuất hóa đơn:", error);
        res.status(500).send("Lỗi server khi tải trang xuất hóa đơn.");
    }
});

// Xử lý xuất hóa đơn
router.post('/create', async(req, res) => {
    try {
        const { productId, quantity, status } = req.body;

        // Tìm sản phẩm
        const product = await Product.findById(productId);
        if (!product) return res.status(404).send('Sản phẩm không tồn tại');

        // Kiểm tra số lượng hàng trong kho
        if (product.quantity < quantity) {
            return res.status(400).send('Số lượng không đủ trong kho');
        }

        // Trừ số lượng sản phẩm trong kho
        product.quantity -= quantity;
        await product.save();

        // Tạo hóa đơn mới
        await Invoice.create({
            product: productId,
            quantity,
            status, // Tình trạng đơn hàng
            date: new Date()
        });

        res.redirect('/invoice/list');
    } catch (error) {
        console.error("Lỗi xuất hóa đơn:", error);
        res.status(500).send('Lỗi xuất hóa đơn: ' + error.message);
    }
});

// Hiển thị danh sách hóa đơn (cho user đã đăng ký và admin)
router.get('/list', checkUser, async(req, res) => {
    try {
        const invoices = await Invoice.find().populate('product');
        res.render('invoiceList', { invoices });
    } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        res.status(500).send("Lỗi server khi tải danh sách hóa đơn.");
    }
});

// Admin xem tất cả hóa đơn
router.get('/all', checkAdmin, async(req, res) => {
    try {
        const invoices = await Invoice.find().populate('product').populate('userId');
        res.render('adminInvoices', { invoices });
    } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn của admin:", error);
        res.status(500).send("Lỗi server khi tải danh sách hóa đơn.");
    }
});

// Admin chỉnh sửa hóa đơn
router.get('/edit/:id', checkAdmin, async(req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('product');
        if (!invoice) return res.status(404).send('Hóa đơn không tồn tại');
        res.render('editInvoice', { invoice });
    } catch (error) {
        console.error("Lỗi khi tải hóa đơn để chỉnh sửa:", error);
        res.status(500).send("Lỗi server khi tải hóa đơn.");
    }
});

// Xử lý cập nhật hóa đơn
router.post('/edit/:id', checkAdmin, async(req, res) => {
    try {
        const { quantity, status, date } = req.body;
        const invoice = await Invoice.findById(req.params.id).populate('product');
        if (!invoice) return res.status(404).send('Hóa đơn không tồn tại');

        // Tìm sản phẩm liên quan đến hóa đơn
        if (invoice.product) {
            const product = await Product.findById(invoice.product._id);
            if (product) {
                product.quantity += invoice.quantity;

                // Kiểm tra số lượng mới
                if (product.quantity < quantity) {
                    return res.status(400).send('Số lượng không đủ');
                }

                // Cập nhật số lượng mới
                product.quantity -= quantity;
                await product.save();
            }
        }

        // Cập nhật thông tin hóa đơn
        invoice.quantity = quantity;
        invoice.status = status;
        invoice.date = new Date(date); // Cập nhật ngày xuất hóa đơn
        await invoice.save();

        res.redirect('/invoice/all'); // Quay lại danh sách hóa đơn admin
    } catch (error) {
        console.error("Lỗi cập nhật hóa đơn:", error);
        res.status(500).send('Lỗi cập nhật hóa đơn: ' + error.message);
    }
});

// Xóa hóa đơn
router.post('/delete/:id', checkAdmin, async(req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('product');
        if (!invoice) {
            return res.status(404).send('Hóa đơn không tồn tại!');
        }

        if (invoice.product) { // Kiểm tra sản phẩm có tồn tại không trước khi truy cập _id
            const product = await Product.findById(invoice.product._id);
            if (product) {
                product.quantity += invoice.quantity; // Hoàn trả số lượng sản phẩm
                await product.save();
            }
        }

        await Invoice.findByIdAndDelete(req.params.id);

        res.redirect('/invoice/all'); // Quay lại danh sách hóa đơn admin
    } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        res.status(500).send('Lỗi xóa hóa đơn: ' + error.message);
    }
});

module.exports = router;