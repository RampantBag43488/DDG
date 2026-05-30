const model = require('../models/bitacora.model.js');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const registros = await model.fetchAll(page, pageSize);
        const total = await model.countBitacora();
        const totalPages = Math.ceil(total / pageSize);

        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizo Bitacora',
            descripcion: `Visualización de la bitácora por usuario ${req.session.nombre}`
        });

        res.render('oc/bitacora/Bitacora', {registros, total, page, pageSize, totalPages});
        
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar la bitácora');
    }
};