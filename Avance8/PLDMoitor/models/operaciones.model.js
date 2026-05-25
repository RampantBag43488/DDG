const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 10, search = '', tipo = '', fecha = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM operaciones';
    let where = [];
    let params = [];

    if (search && search !== '') {
        where.push(`(
            CAST(id_operacion AS TEXT) ILIKE $${params.length + 1} OR
            CAST(cliente_id AS TEXT) ILIKE $${params.length + 1} OR
            CAST(id_contrato AS TEXT) ILIKE $${params.length + 1} OR
            tipo_operacion ILIKE $${params.length + 1} OR
            CAST(fecha_operacion AS TEXT) ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (tipo && tipo !== '') {
        where.push(`tipo_operacion = $${params.length + 1}`);
        params.push(tipo);
    }
    if (fecha && fecha !== '') {
        where.push(`CAST(fecha_operacion AS DATE) = $${params.length + 1}`);
        params.push(fecha);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    query += ' ORDER BY id_operacion LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(pageSize, offset);
    const { rows } = await pool.query(query, params);
    return rows;
};

exports.countOperacionesFiltered = async (search = '', tipo = '', fecha = '') => {
    let query = 'SELECT COUNT(*) AS totaloperaciones FROM operaciones';
    let where = [];
    let params = [];
    if (search && search !== '') {
        where.push(`(
            CAST(id_operacion AS TEXT) ILIKE $${params.length + 1} OR
            CAST(cliente_id AS TEXT) ILIKE $${params.length + 1} OR
            CAST(id_contrato AS TEXT) ILIKE $${params.length + 1} OR
            tipo_operacion ILIKE $${params.length + 1} OR
            CAST(fecha_operacion AS TEXT) ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (tipo && tipo !== '') {
        where.push(`tipo_operacion = $${params.length + 1}`);
        params.push(tipo);
    }
    if (fecha && fecha !== '') {
        where.push(`CAST(fecha_operacion AS DATE) = $${params.length + 1}`);
        params.push(fecha);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    const { rows } = await pool.query(query, params);
    return rows[0].totaloperaciones;
};