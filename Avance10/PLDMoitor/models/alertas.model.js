const pool = require('../util/database.js');

// Obtener alertas por cliente_id
exports.fetchByCliente = async (cliente_id, page = 1, pageSize = 10, search = '', riesgo = '', estatus = '', fecha = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM alertas';
    let where = ['cliente_id = $1'];
    let params = [cliente_id];
    if (search) {
        where.push(`(
            CAST(id_alerta AS TEXT) ILIKE $${params.length + 1} OR
            tipo_alerta ILIKE $${params.length + 1} OR
            motivo ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (riesgo) {
        where.push('riesgo ILIKE $' + (params.length + 1));
        params.push(riesgo);
    }
    if (estatus) {
        where.push('estatus ILIKE $' + (params.length + 1));
        params.push(estatus);
    }
    if (fecha) {
        where.push('CAST(fecha_generacion AS DATE) = $' + (params.length + 1));
        params.push(fecha);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    query += ' ORDER BY id_alerta DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(pageSize, offset);
    const { rows } = await pool.query(query, params);
    return rows;
};

// Contar alertas por cliente con filtros
exports.countAlertasByCliente = async (cliente_id, search = '', riesgo = '', estatus = '', fecha = '') => {
    let query = 'SELECT COUNT(*) AS totalalertas FROM alertas';
    let where = ['cliente_id = $1'];
    let params = [cliente_id];
    if (search) {
        where.push(`(
            CAST(id_alerta AS TEXT) ILIKE $${params.length + 1} OR
            tipo_alerta ILIKE $${params.length + 1} OR
            motivo ILIKE $${params.length + 1}
        )`);
        params.push(`%${search}%`);
    }
    if (riesgo) {
        where.push('riesgo ILIKE $' + (params.length + 1));
        params.push(riesgo);
    }
    if (estatus) {
        where.push('estatus ILIKE $' + (params.length + 1));
        params.push(estatus);
    }
    if (fecha) {
        where.push('CAST(fecha_generacion AS DATE) = $' + (params.length + 1));
        params.push(fecha);
    }
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].totalalertas, 10);
};

exports.fetchAll = async (page = 1, pageSize = 10, search = '', status = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM alertas';
    let where = []; // Condiciones WHERE
    let params = []; // Parametros para parametrizar

    // Busqueda
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
    // Filtro por estatus
    if (status && status !== '') {
        where.push(`estatus ILIKE $${params.length + 1}`);
        params.push(status);
    }
    // Aplicar filtros
    if (where.length > 0) {
        query += ' WHERE ' + where.join(' AND ');
    }
    query += ' ORDER BY id_alerta LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
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

// Obtener una alerta por ID
exports.findById = async (id_alerta) => {
    const { rows } = await pool.query('SELECT * FROM alertas WHERE id_alerta = $1', [id_alerta]);
    return rows[0] || null;
};

// Actualizar alerta (solo estatus) - maneja fecha_cierre automaticamente
exports.updateAlerta = async (id_alerta, estatus) => {
    let fecha_cierre = null;
    
    // Si el estatus es "cerrada", establecer fecha_cierre al momento actual
    if (estatus === 'cerrada') {
        fecha_cierre = new Date();
    }
    // Si el estatus es "abierta" o "en revision", fecha_cierre debe ser NULL
    
    const query = `
        UPDATE alertas 
        SET estatus = $1, fecha_cierre = $2
        WHERE id_alerta = $3
    `;
    await pool.query(query, [estatus, fecha_cierre, id_alerta]);
};
