const model = require('../models/reportes.model.js');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const reportes = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countReportesFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Mensajes Anonimos',
            descripcion: `Visualización de mensajes anonimos por usuario ${req.session.nombre}`
        });
        res.render('oc/reportes/Reportes', { reportes, total, page, pageSize, totalPages, search, status });
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
        const search = req.query.search || '';
        const status = req.query.status || '';
        const reportes = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countReportesFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó pagina de Mensajes Anonimos',
            descripcion: `Visualización de pagina de mensajes anonimos por usuario ${req.session.nombre}`
        });
        res.render('empleado/reportes/Reportes', { reportes, total, page, pageSize, totalPages, search, status });
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

        res.redirect('/oficial/Reportes?success=1');
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

        res.redirect('/empleado/Reportes?success=1');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al guardar reporte');
    }
};
