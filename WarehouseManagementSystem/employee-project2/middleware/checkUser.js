module.exports = function checkUser(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
    next();
};