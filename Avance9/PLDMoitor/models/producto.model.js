const pool = require('../util/database.js');

exports.fetchAll = async () => {
    const { rows } = await pool.query(`
        SELECT id_producto, nombre_producto, tipo_producto
        FROM producto
        ORDER BY id_producto DESC
    `);
    return rows;
};