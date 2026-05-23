const model = require('../models/reportes.model.js');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const reportes = await model.fetchAll(page, pageSize);
        const total = await model.countReportes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/reportes/Reportes', { reportes, total, page, pageSize, totalPages });
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Mensajes Anonimos',
            descripcion: `Visualización de mensajes anonimos por usuario ${req.session.nombre}`
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar mensajes anonimos');
    }
};

module.exports.indexEmpleado = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const reportes = await model.fetchAll(page, pageSize);
        const total = await model.countReportes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('empleado/reportes/Reportes', { reportes, total, page, pageSize, totalPages });
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó pagina de Mensajes Anonimos',
            descripcion: `Visualización de pagina de mensajes anonimos por usuario ${req.session.nombre}`
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar mensajes anonimos');
    }
};

module.exports.create = async (req, res) => {
    try {
        const { acusado, fecha, descripcion } = req.body;

        if (!acusado || !fecha || !descripcion) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        await model.create({
            acusado,
            fecha_generacion: fecha,
            descripcion,
            evidencia_adjunta: null,
            estatus: 'pendiente',
            formato_salida: 'PDF'
        });

        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Creo mensaje anonimo',
            descripcion: `Creación de mensaje anonimo por usuario ${req.session.nombre}`
        });

        res.redirect('/oficial/Reportes');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al guardar reporte');
    }
};

module.exports.createEmpleado = async (req, res) => {
    try {
        const { acusado, fecha, descripcion } = req.body;

        if (!acusado || !fecha || !descripcion) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        await model.create({
            acusado,
            fecha_generacion: fecha,
            descripcion,
            evidencia_adjunta: null,
            estatus: 'pendiente',
            formato_salida: 'PDF'
        });

        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Creo mensaje anonimo',
            descripcion: `Creación de mensaje anonimo por usuario ${req.session.nombre}`
        });

        res.redirect('/empleado/Reportes');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al guardar reporte');
    }
};
