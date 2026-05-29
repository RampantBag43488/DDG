const pool = require('../util/database.js');

// Verificar si un cliente tiene contratos activos
exports.hasContratosActivos = async (cliente_id) => {
    const { rows } = await pool.query(
        'SELECT COUNT(*) as total FROM contrato WHERE cliente_id = $1 AND estatus_contrato != $2',
        [cliente_id, 'cancelado']
    );
    return parseInt(rows[0].total, 10) > 0;
};

// Dar de baja un contrato (cambiar estatus a 'cancelado')
exports.darDeBaja = async (cliente_id, id_usuario) => {
    const sql = `
        UPDATE contrato 
        SET estatus_contrato = $1
        WHERE cliente_id = $2 AND estatus_contrato != $3
    `;
    await pool.query(sql, ['cancelado', cliente_id, 'cancelado']);
};

// Obtener contratos activos de un cliente
exports.getContratosActivos = async (cliente_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM contrato WHERE cliente_id = $1 AND estatus_contrato != $2',
        [cliente_id, 'cancelado']
    );
    return rows;
};

// Obtener todos los contratos de un cliente con paginación y filtros
exports.fetchByCliente = async (cliente_id, page = 1, pageSize = 10, search = '', estatus = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM contrato WHERE cliente_id = $1';
    let params = [cliente_id];
    let paramIndex = 2;

    if (search && search !== '') {
        query += ` AND (
            CAST(id_contrato AS TEXT) ILIKE $${paramIndex} OR
            folio_contrato ILIKE $${paramIndex + 1} OR
            tipo_contrato ILIKE $${paramIndex + 2} OR
            estatus_contrato ILIKE $${paramIndex + 3}
        )`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        paramIndex += 4;
    }

    if (estatus && estatus !== '') {
        query += ` AND estatus_contrato = $${paramIndex}`;
        params.push(estatus);
        paramIndex++;
    }

    query += ` ORDER BY id_contrato DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(pageSize, offset);

    const { rows } = await pool.query(query, params);
    return rows;
};

// Contar contratos de un cliente con filtros
exports.countContratosByCliente = async (cliente_id, search = '', estatus = '') => {
    let query = 'SELECT COUNT(*) as total FROM contrato WHERE cliente_id = $1';
    let params = [cliente_id];
    let paramIndex = 2;

    if (search && search !== '') {
        query += ` AND (
            CAST(id_contrato AS TEXT) ILIKE $${paramIndex} OR
            folio_contrato ILIKE $${paramIndex + 1} OR
            tipo_contrato ILIKE $${paramIndex + 2} OR
            estatus_contrato ILIKE $${paramIndex + 3}
        )`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        paramIndex += 4;
    }

    if (estatus && estatus !== '') {
        query += ` AND estatus_contrato = $${paramIndex}`;
        params.push(estatus);
    }

    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].total, 10);
};

// Obtener estatus únicos de contratos
exports.getEstatusContrato = async () => {
    const { rows } = await pool.query(
        'SELECT DISTINCT estatus_contrato FROM contrato ORDER BY estatus_contrato'
    );
    return rows.map(row => row.estatus_contrato);
};
