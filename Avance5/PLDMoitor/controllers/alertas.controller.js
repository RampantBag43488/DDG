const model = require('../models/alertas.model');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const alertas = await model.fetchAll(page, pageSize);
        const total = await model.countAlertas();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/alertas/Alertas', { alertas, total, page, pageSize, totalPages });
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