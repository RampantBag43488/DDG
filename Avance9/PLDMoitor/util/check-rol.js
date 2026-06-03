module.exports = (rolRequerido) => {
    return (req, res, next) => {
        if (req.session.rol === rolRequerido) return next();
        return res.status(403).send('Acceso denegado');
    };
};