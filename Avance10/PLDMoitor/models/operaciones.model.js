const pool = require('../util/database.js');

// Obtener operaciones por cliente_id
exports.fetchByCliente = async (cliente_id, page = 1, pageSize = 10, search = '', tipo = '', fecha = '') => {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM operaciones WHERE cliente_id = $1';
    let params = [cliente_id];

    if (search && search !== '') {
        const i = params.length + 1;
        query += ` AND (
            CAST(id_operacion AS TEXT) ILIKE $${i} OR
            tipo_operacion ILIKE $${i + 1} OR
            CAST(fecha_operacion AS TEXT) ILIKE $${i + 2}
        )`;
        // Por cada $N distinto
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (tipo && tipo !== '') {
        query += ` AND tipo_operacion = $${params.length + 1}`;
        params.push(tipo);
    }

    if (fecha && fecha !== '') {
        query += ` AND CAST(fecha_operacion AS DATE) = $${params.length + 1}`;
        params.push(fecha);
    }

    query += ` ORDER BY id_operacion DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, offset);

    const { rows } = await pool.query(query, params);
    return rows;
};


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

// Contar operaciones por cliente con filtros
exports.countOperacionesByCliente = async (cliente_id, search = '', tipo = '', fecha = '') => {
    let query = 'SELECT COUNT(*) AS totaloperaciones FROM operaciones';
    let where = ['cliente_id = $1'];
    let params = [cliente_id];
    if (search && search !== '') {
        where.push(`(
            CAST(id_operacion AS TEXT) ILIKE $${params.length + 1} OR
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
    return parseInt(rows[0].totaloperaciones, 10);
};

// Contratos del cliente
exports.fetchContratosByCliente = async (cliente_id) => {
    const { rows } = await pool.query(
        `SELECT id_contrato, folio_contrato, tipo_contrato
         FROM contrato
         WHERE cliente_id = $1
         ORDER BY fecha_inicio DESC`,
        [cliente_id]
    );
    return rows;
};

// Registrar nueva Operacion
exports.create = async ({
    cliente_id,
    id_contrato,
    tipo_operacion,
    fecha_operacion,
    monto,
    clasificacion,
    estatus,
    nivel_riesgo,
    observaciones
}) => {
    const sql = `
        INSERT INTO operaciones (
            cliente_id,
            id_contrato,
            tipo_operacion,
            fecha_operacion,
            monto,
            clasificacion,
            estatus,
            nivel_riesgo,
            observaciones
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
    `;

    const values = [
        cliente_id,
        id_contrato,
        tipo_operacion,
        fecha_operacion,
        monto,
        clasificacion,
        estatus,
        nivel_riesgo,
        observaciones || null
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

exports.findContratoByIdAndCliente = async (id_contrato, cliente_id) => {
    const { rows } = await pool.query(
        `SELECT *
         FROM contrato
         WHERE id_contrato = $1 AND cliente_id = $2
         LIMIT 1`,
        [id_contrato, cliente_id]
    );
    return rows[0] || null;
};

exports.getPromedioMontoPorTipo = async (cliente_id, id_contrato, tipo_operacion, excludeOperacionId) => {
    const { rows } = await pool.query(
        `SELECT AVG(monto) AS promedio
         FROM operaciones
         WHERE cliente_id = $1
           AND id_contrato = $2
           AND LOWER(tipo_operacion) = LOWER($3)
           AND id_operacion <> $4`,
        [cliente_id, id_contrato, tipo_operacion, excludeOperacionId]
    );
    return Number(rows[0].promedio || 0);
};

exports.countSameTypeSameDay = async (cliente_id, id_contrato, tipo_operacion, fecha_operacion, excludeOperacionId) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total
         FROM operaciones
         WHERE cliente_id = $1
           AND id_contrato = $2
           AND LOWER(tipo_operacion) = LOWER($3)
           AND DATE(fecha_operacion) = DATE($4)
           AND id_operacion <> $5`,
        [cliente_id, id_contrato, tipo_operacion, fecha_operacion, excludeOperacionId]
    );
    return Number(rows[0].total || 0);
};

exports.countLast24h = async (cliente_id, id_contrato, fecha_operacion, excludeOperacionId) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) AS total
         FROM operaciones
         WHERE cliente_id = $1
           AND id_contrato = $2
           AND fecha_operacion >= ($3::timestamp - interval '24 hours')
           AND fecha_operacion <= $3::timestamp
           AND id_operacion <> $4`,
        [cliente_id, id_contrato, fecha_operacion, excludeOperacionId]
    );
    return Number(rows[0].total || 0);
};