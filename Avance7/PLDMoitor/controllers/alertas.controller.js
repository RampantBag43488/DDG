const model = require('../models/alertas.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const alertas = await model.fetchAll(page, pageSize);
        const total = await model.countAlertas();
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó alertas',
            descripcion: `Visualización de la página de alertas por el usuario ${req.session.nombre}`
        });
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