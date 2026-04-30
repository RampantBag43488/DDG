const pool = require('../util/database');

exports.fetchAll = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query(
        'SELECT * FROM alertas ORDER BY id_alerta LIMIT $1 OFFSET $2', 
        [pageSize, offset]
    );
    return rows;
};

exports.countAlertas = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totalalertas FROM alertas');
    return rows[0].totalalertas;
};

exports.getAlertas = async () => {
    const{ rows } = await pool.query('SELECT * FROM alertas');
    return rows;
};