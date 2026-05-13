const model = require('../models/auth.model.js');
const bcrypt = require('bcryptjs');

exports.render_login = (req, res) => {
    res.render('auth/login/Login', { registro: false });
};

exports.do_login = async (req, res) => {
    try {
        const usuario = await model.User.findByID(req.body.usuario);
        if (!usuario) {
            return res.redirect('/login');
        }

        const doMatch = await bcrypt.compare(req.body.password, usuario.contrasena);
        if (!doMatch) {
            return res.redirect('/login');
        }

        req.session.id_usuario   = usuario.id_usuario;
        req.session.nombre     = usuario.nombre;
        req.session.isLoggedIn = true;
        req.session. rol       = usuario.rol;

        if (usuario.rol =='gestion'){
            return res.redirect('/gestion/Dashboard');
        }else if (usuario.rol == 'oficial_cumplimiento'){
            return res.redirect('/oficial/Dashboard');
        }else if (usuario.rol == 'empleado'){
            return res.redirect('/empleado/Dashboard');
        }else if (usuario.rol == 'auditoria'){
            return res.redirect('/auditoria');
        }

    } catch (e) {
        console.error(e);
        res.redirect('/login');
    }
};

exports.do_logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

