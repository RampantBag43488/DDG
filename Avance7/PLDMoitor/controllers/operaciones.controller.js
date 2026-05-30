const model = require('../models/operaciones.model.js');
const registrarBitacora = require('../util/bitacora.js');
module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        const search = req.query.search || '';
        const tipo = req.query.tipo || '';
        const fecha = req.query.fecha || '';

        const operaciones = await model.fetchAll(page, pageSize, search, tipo, fecha);
        const total = await model.countOperacionesFiltered(search, tipo, fecha);
        const totalPages = Math.ceil(total / pageSize);

        try {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'VISUALIZO_OPERACIONES',
                descripcion: `Visualización de operaciones por usuario ${req.session.nombre}`
            });
        } catch (bitacoraError) {
            console.log('Error al registrar en bitácora:', bitacoraError);
        }

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

module.exports.indexEmpleado = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        const search = req.query.search || '';
        const tipo = req.query.tipo || '';
        const fecha = req.query.fecha || '';

        const operaciones = await model.fetchAll(page, pageSize, search, tipo, fecha);
        const total = await model.countOperacionesFiltered(search, tipo, fecha);
        const totalPages = Math.ceil(total / pageSize);

        try {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'VISUALIZO_TRANSACCIONES',
                descripcion: `Visualización de transacciones por usuario ${req.session.nombre}`
            });
        } catch (bitacoraError) {
            console.log('Error al registrar en bitácora:', bitacoraError);
        }

        res.render('empleado/transacciones/Transacciones', { operaciones, total, page, pageSize, totalPages, search, tipo, fecha });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar transacciones');
    }
};