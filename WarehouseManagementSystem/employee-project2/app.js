const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import model User
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoice');
const path = require('path');


const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/warehouse')
    .then(() => {
        console.log('✅ Kết nối MongoDB thành công!');
        createAdminIfNotExists(); // Tạo admin khi kết nối thành công
    })
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Hàm kiểm tra và tạo tài khoản admin
async function createAdminIfNotExists() {
    const existingAdmin = await User.findOne({ username: 'admin' }); // Kiểm tra username
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin', // Không cần email, chỉ cần username
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log("✅ Tài khoản admin đã được tạo thành công!");
    } else {
        console.log("⚠️ Admin đã tồn tại.");
    }
}

// Middleware
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Middleware để kiểm tra đăng nhập và truyền biến `user` vào template
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Sử dụng routes
app.use(authRoutes);
app.use(productRoutes);
app.use('/product', productRoutes);
app.use('/invoice', invoiceRoutes);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


// Chạy server
app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));