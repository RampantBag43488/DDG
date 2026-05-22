module.exports.actualizarVista = async (req, res) => {
    try {
        const id_expediente = req.query.id_expediente;
        if (!id_expediente) return res.redirect('/oficial/Expediente');
        const expediente = await model.getById(id_expediente);
        if (!expediente) return res.status(404).send('Expediente no encontrado');
        res.render('oc/expediente/ActualizarExpediente', { expediente });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expediente');
    }
};

module.exports.actualizarExpediente = async (req, res) => {
    try {
        const id_expediente = req.body.id_expediente;
        if (!id_expediente) return res.redirect('/oficial/Expediente');
        // pasar datos
        const data = {
            cliente_id: req.body.cliente_id,
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno,
            apellido_materno: req.body.apellido_materno,
            fecha_apertura: req.body.fecha_apertura,
            fecha_actualizacion: req.body.fecha_actualizacion,
            estatus_expediente: req.body.estatus_expediente,
            tipo_expediente: req.body.tipo_expediente,
            observaciones: req.body.observaciones
        };
        await model.updateExpediente(id_expediente, data);
        res.redirect('/oficial/Expediente');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al actualizar expediente');
    }
};
const model = require('../models/expediente.model');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/expediente/Expediente', { expedientes, total, page, pageSize, totalPages });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expedientes');
    }
};

module.exports.nuevo = (req, res) => {
    res.render('oc/expediente/NuevoExpediente');
};

module.exports.nuevoEmpleado = (req, res) => {
    res.render('empleado/expedientes/NuevoExpediente');
};

module.exports.indexEmpleado = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('empleado/expedientes/Expedientes', { expedientes, total, page, pageSize, totalPages });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expedientes');
    }
};

module.exports.getExpedientes = async (req, res) => {
    const expedientes = await model.getExpedientes();
    res.status(200).json({ total: expedientes});
};