const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Đảm bảo đường dẫn đúng với model User của bạn

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/warehouse', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("✅ Kết nối MongoDB thành công"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Tạo tài khoản admin
async function createAdmin() {
    try {
        // Kiểm tra nếu admin đã tồn tại
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log("⚠️ Admin đã tồn tại!");
            mongoose.connection.close();
            return;
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Thêm admin vào database
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 123,
            role: 'admin'
        });

        await adminUser.save();
        console.log("✅ Tạo tài khoản admin thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi tạo admin:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Gọi hàm tạo admin
createAdmin();