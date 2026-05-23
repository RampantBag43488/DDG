const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 5, search = '', status = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM reportes';
    let where = [];
    let params = [];

    if (search) {
        where.push(`(
            CAST(id_reporte AS TEXT) ILIKE $${params.length + 1} OR
            acusado ILIKE $${params.length + 1} OR
            CAST(fecha_generacion AS TEXT) ILIKE $${params.length + 1} OR
            descripcion ILIKE $${params.length + 1} OR
            evidencia_adjunta ILIKE $${params.length + 1} OR
            estatus ILIKE $${params.length + 1} OR
            formato_salida ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (status && status !== '') {
        where.push(`estatus ILIKE $${params.length + 1}`);
        params.push(status);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    query += ' ORDER BY id_reporte LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(pageSize, offset);
    const {rows} = await pool.query(query, params);
    return rows;
};
    
exports.countReportesFiltered = async (search = '', status = '') => {
    let query = 'SELECT COUNT(*) AS totalreportes FROM reportes';
    let where = [];
    let params = [];
    if (search) {
        where.push(`(
            CAST(id_reporte AS TEXT) ILIKE $${params.length + 1} OR
            acusado ILIKE $${params.length + 1} OR
            CAST(fecha_generacion AS TEXT) ILIKE $${params.length + 1} OR
            descripcion ILIKE $${params.length + 1} OR
            evidencia_adjunta ILIKE $${params.length + 1} OR
            estatus ILIKE $${params.length + 1} OR
            formato_salida ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (status && status !== '') {
        where.push(`estatus ILIKE $${params.length + 1}`);
        params.push(status);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    const {rows} = await pool.query(query, params);
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