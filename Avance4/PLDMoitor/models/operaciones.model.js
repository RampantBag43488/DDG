const pool = require('../util/database.js');

exports.fetchAll = async(page = 1, pageSize = 10) =>{
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query('SELECT * FROM operaciones ORDER BY id_operacion LIMIT $1 OFFSET $2', [pageSize, offset]);
    return rows;
}

exports.countOperaciones = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totaloperaciones FROM operaciones');
    return rows[0].totaloperaciones;
};