const model = require('../models/reportes.model.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const reportes = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countReportesFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/reportes/Reportes', { reportes, total, page, pageSize, totalPages, search, status });
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
        const search = req.query.search || '';
        const status = req.query.status || '';
        const reportes = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countReportesFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        res.render('empleado/reportes/Reportes', { reportes, total, page, pageSize, totalPages, search, status });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar reportes');
    }
};
