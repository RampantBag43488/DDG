const pool = require('../util/database');

exports.fetchAll = async (page = 1, pageSize = 5) => {
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query(
        'SELECT * FROM expediente ORDER BY id_expediente LIMIT $1 OFFSET $2', 
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