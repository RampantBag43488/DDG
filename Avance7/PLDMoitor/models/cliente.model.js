const pool = require('../util/database');

exports.getById = async (cliente_id) => {
    const { rows } = await pool.query('SELECT * FROM cliente WHERE cliente_id = $1', [cliente_id]);
    return rows[0];
};
