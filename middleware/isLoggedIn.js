function isLoggedIn(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You must be sighned in to access page');
        res.redirect('/auth/login');
    } else {
        next();
    }
}
module.exports = isLoggedIn;
