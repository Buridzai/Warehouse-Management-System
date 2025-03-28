module.exports = function checkAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send("Bạn không có quyền truy cập!");
    }
    next();
};