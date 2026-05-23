const pool = require('../util/database');


exports.fetchAll = async (page = 1, pageSize = 10, search = '', status = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM alertas';
    let where = []; // Condiciones WHERE
    let params = []; // Parámetros para la consulta parametrizada

    // Búsqueda en múltiples campos
    if (search) { 
        where.push(`(
            CAST(id_alerta AS TEXT) ILIKE $${params.length + 1} OR
            CAST(cliente_id AS TEXT) ILIKE $${params.length + 1} OR
            CAST(id_operacion AS TEXT) ILIKE $${params.length + 1} OR
            tipo_alerta ILIKE $${params.length + 1} OR
            motivo ILIKE $${params.length + 1} OR
            evidencia_asociada ILIKE $${params.length + 1} OR
            CAST(fecha_generacion AS TEXT) ILIKE $${params.length + 1} OR
            estatus ILIKE $${params.length + 1} OR
            CAST(fecha_cierre AS TEXT) ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`); // El texto puede aparecer en cualquier campo
    }
    // Filtro por estatus
    if (status && status !== '') {
        where.push(`estatus ILIKE $${params.length + 1}`);
        params.push(status);
    }
    // Aplicar filtros
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    query += ' ORDER BY id_alerta LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2); // Paginacion de 10 en 10
    params.push(pageSize, offset);
    const {rows} = await pool.query(query, params);
    return rows;
};

exports.countAlertasFiltered = async (search = '', status = '') => {
    let query = 'SELECT COUNT(*) AS totalalertas FROM alertas';
    let where = [];
    let params = [];
    if (search) {
        where.push(`(
            CAST(id_alerta AS TEXT) ILIKE $${params.length + 1} OR
            CAST(cliente_id AS TEXT) ILIKE $${params.length + 1} OR
            CAST(id_operacion AS TEXT) ILIKE $${params.length + 1} OR
            tipo_alerta ILIKE $${params.length + 1} OR
            motivo ILIKE $${params.length + 1} OR
            evidencia_asociada ILIKE $${params.length + 1} OR
            CAST(fecha_generacion AS TEXT) ILIKE $${params.length + 1} OR
            estatus ILIKE $${params.length + 1} OR
            CAST(fecha_cierre AS TEXT) ILIKE $${params.length + 1}
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
    return rows[0].totalalertas;
};
exports.countAlertas = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totalalertas FROM alertas');
    return rows[0].totalalertas;
};

exports.getAlertas = async () => {
    const{ rows } = await pool.query('SELECT * FROM alertas');
    return rows;
};