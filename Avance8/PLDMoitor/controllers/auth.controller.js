const model = require('../models/auth.model.js');
const bcrypt = require('bcryptjs');
const registrarBitacora = require('../util/bitacora.js');

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

        await registrarBitacora({
            id_usuario: usuario.id_usuario,
            accion: 'LOGIN',
            descripcion: `Acceso al sistema por usuario ${usuario.nombre}`
        });

        req.session.save((e) => {
            if (e) {
                console.error("Error al guardar la sesión:", e);
                return res.redirect('/login');
            }

            if (usuario.rol =='gestion'){
                return res.redirect('/gestion/Dashboard');
            }else if (usuario.rol == 'oficial_cumplimiento'){
                return res.redirect('/oficial/Dashboard');
            }else if (usuario.rol == 'empleado'){
                return res.redirect('/empleado/Dashboard');
            }else if (usuario.rol == 'auditoria'){
                return res.redirect('/auditoria');
            }

            return res.redirect('/login');
        });

    } catch (e) {
        console.error(e);
        res.redirect('/login');
    }
};

exports.do_logout = async (req, res) => {
    await registrarBitacora({
        id_usuario: req.session.id_usuario,
        accion: 'LOGOUT',
        descripcion: `Cierre de sesión por usuario ${req.session.nombre}`
    });
    req.session.destroy((e) => {
        if (e) {
            console.error("Error al destruir la sesión:", e);
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

