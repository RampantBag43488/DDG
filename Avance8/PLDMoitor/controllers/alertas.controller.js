const model = require('../models/alertas.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const alertas = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countAlertasFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó alertas',
            descripcion: `Visualización de la página de alertas por el usuario ${req.session.nombre}`
        });
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