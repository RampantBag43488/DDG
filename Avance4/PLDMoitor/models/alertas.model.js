const pool = require('../util/database');

exports.getAlertas = async () => {
    const{ rows } = await pool.query('SELECT * FROM alertas');
    return rows;
};