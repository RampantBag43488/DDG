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

exports.create = async ({ acusado, fecha_generacion, descripcion, evidencia_adjunta, estatus, formato_salida }) => {
    const sql = `
        INSERT INTO reportes (
            acusado,
            fecha_generacion,
            descripcion,
            evidencia_adjunta,
            estatus,
            formato_salida
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_reporte
    `;

    const values = [
        acusado,
        fecha_generacion,
        descripcion,
        evidencia_adjunta,
        estatus,
        formato_salida
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

//exports.getReportes = async() =>{
//    const {rows} = await pool.query('SELECT * FROM reportes ORDER BY id_reporte');
//    console.log(rows[0]);
//    return rows;
//};