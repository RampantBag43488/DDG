module.exports = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.session.rol)) return next();
        return res.status(403).send('Acceso denegado');
    };
};