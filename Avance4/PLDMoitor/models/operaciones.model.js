const pool = require('../util/database.js');

exports.getOperaciones = async() =>{
    const {rows} = await pool.query('SELECT * FROM operaciones ORDER BY id_operacion');
    return rows;
}