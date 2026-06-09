const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * pageSize;
    const { rows } = await pool.query(
        'SELECT * FROM bitacora ORDER BY fecha_hora DESC LIMIT $1 OFFSET $2',
        [pageSize, offset]
    );
    return rows;
};

exports.countBitacora = async () => {
    const { rows } = await pool.query('SELECT COUNT(*) AS totalbitacora FROM bitacora');
    return rows[0].totalbitacora;
};