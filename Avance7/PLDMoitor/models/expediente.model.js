const pool = require('../util/database');

exports.fetchAll = async (page = 1, pageSize = 5) => {
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query(`
        SELECT 
            e.id_expediente,
            e.cliente_id,
            e.fecha_apertura,
            e.fecha_actualizacion,
            e.estatus_expediente,
            e.tipo_expediente,
            e.observaciones,

            c.tipo_persona,

            pf.nombre,
            pf.apellido_paterno,
            pf.apellido_materno,

            pm.razon_social

        FROM expediente e
        JOIN cliente c 
            ON e.cliente_id = c.cliente_id

        LEFT JOIN persona_fisica pf 
            ON e.cliente_id = pf.cliente_id

        LEFT JOIN persona_moral pm 
            ON e.cliente_id = pm.cliente_id

        ORDER BY e.id_expediente DESC
        LIMIT $1 OFFSET $2`, 
        [pageSize, offset]
    );
    return rows;
};

exports.countExpedientes = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totalexpedientes FROM expediente');
    return rows[0].totalexpedientes;
};

exports.getExpedientes = async () => {
    const{ rows } = await pool.query('SELECT * FROM expediente');
    return rows;
};