const model = require('../models/operaciones.model.js');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        //filtros (SIEMPRE van aquí)
        const search = req.query.search || '';
        const tipo = req.query.tipo || '';
        const fecha = req.query.fecha || '';

        //consulta con o sin filtro
        const operaciones = await model.fetchAll(page, pageSize, search, tipo, fecha);
        const total = await model.countOperacionesFiltered(search, tipo, fecha);
        const totalPages = Math.ceil(total / pageSize);

        //bitácora
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Operaciones',
            descripcion: `Visualización de operaciones por usuario ${req.session.nombre}`
        });

        //render
        res.render('oc/operaciones/Operaciones', {
            operaciones,
            total,
            page,
            pageSize,
            totalPages,
            search,
            tipo,
            fecha
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar operaciones');
    }
};