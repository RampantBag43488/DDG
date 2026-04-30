const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 5) => {
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query('SELECT * FROM reportes ORDER BY id_reporte LIMIT $1 OFFSET $2', [pageSize, offset]);
    return rows;
};
    
exports.countReportes = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totalreportes FROM reportes');
    return rows[0].totalreportes;
};

//exports.getReportes = async() =>{
//    const {rows} = await pool.query('SELECT * FROM reportes ORDER BY id_reporte');
//    console.log(rows[0]);
//    return rows;
//};