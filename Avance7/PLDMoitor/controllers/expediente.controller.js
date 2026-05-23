const model = require('../models/expediente.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/expediente/Expediente', { expedientes, total, page, pageSize, totalPages });
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Expedientes',
            descripcion: `Visualización de expedientes por usuario ${req.session.nombre}`
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expedientes');
    }
};

module.exports.nuevo = async (req, res) => {
    res.render('oc/expediente/NuevoExpediente');
    await registrarBitacora({
        id_usuario: req.session.id_usuario,
        accion: 'Creo un Nuevo Expediente',
        descripcion: `Creación de nuevo expediente por usuario ${req.session.nombre}`
    });
};

module.exports.nuevoEmpleado = async (req, res) => {
    res.render('empleado/expedientes/NuevoExpediente');
    await registrarBitacora({
        id_usuario: req.session.id_usuario,
        accion: 'Creo un Nuevo Expediente',
        descripcion: `Creación de nuevo expediente por usuario ${req.session.nombre}`
    });
};

module.exports.indexEmpleado = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Expedientes',
            descripcion: `Visualización de expedientes por usuario ${req.session.nombre}`
        });
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