const model = require('../models/alertas.model');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const alertas = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countAlertasFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/alertas/Alertas', { alertas, total, page, pageSize, totalPages, search, status });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar alertas');
    }
};

module.exports.getAlertas = async (req, res) => {
    const alertas = await model.getAlertas();
    res.status(200).json({ total: alertas});
};