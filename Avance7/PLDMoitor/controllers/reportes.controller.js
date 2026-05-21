const model = require('../models/reportes.model.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const reportes = await model.fetchAll(page, pageSize);
        const total = await model.countReportes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/reportes/Reportes', { reportes, total, page, pageSize, totalPages });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar reportes');
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
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar reportes');
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

        res.redirect('/empleado/Reportes');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al guardar reporte');
    }
};
