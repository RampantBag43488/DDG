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