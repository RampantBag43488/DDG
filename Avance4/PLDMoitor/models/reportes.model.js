const pool = require('../util/database.js');

exports.getReportes = async() =>{
    const {rows} = await pool.query('SELECT * FROM reportes ORDER BY id_reporte');
    console.log(rows[0]);
    return rows;
};