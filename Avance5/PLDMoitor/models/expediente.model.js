const pool = require('../util/database');

exports.getExpedientes = async () => {
    const{ rows } = await pool.query('SELECT * FROM expediente');
    return rows;
};