const pool = require('../util/database.js');

exports.fetchAll = async (page = 1, pageSize = 10, search = '', tipo = '', estatus = '') => {
    const offset = (page - 1) * pageSize;
    let query = `
        SELECT id_producto, nombre_producto, tipo_producto, descripcion, estatus, fecha_registro
        FROM producto
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
        params.push(`%${search}%`);
        query += ` AND (nombre_producto ILIKE $${paramIndex++} OR descripcion ILIKE $${paramIndex++})`;
        params.push(`%${search}%`);
    }

    if (tipo) {
        params.push(tipo.toLowerCase());
        query += ` AND LOWER(tipo_producto) = $${paramIndex++}`;
    }

    if (estatus) {
        params.push(estatus.toLowerCase());
        query += ` AND LOWER(estatus) = $${paramIndex++}`;
    }

    query += ` ORDER BY id_producto DESC LIMIT ${pageSize} OFFSET ${offset}`;

    const { rows } = await pool.query(query, params);
    return rows;
};

exports.countProductosFiltered = async (search = '', tipo = '', estatus = '') => {
    let query = `SELECT COUNT(*) FROM producto WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (search) {
        params.push(`%${search}%`);
        query += ` AND (nombre_producto ILIKE $${paramIndex++} OR descripcion ILIKE $${paramIndex++})`;
        params.push(`%${search}%`);
    }

    if (tipo) {
        params.push(tipo.toLowerCase());
        query += ` AND LOWER(tipo_producto) = $${paramIndex++}`;
    }

    if (estatus) {
        params.push(estatus.toLowerCase());
        query += ` AND LOWER(estatus) = $${paramIndex++}`;
    }

    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].count);
};

exports.fetchAllSimple = async () => {
    const { rows } = await pool.query(`
        SELECT id_producto, nombre_producto, tipo_producto
        FROM producto
        ORDER BY id_producto DESC
    `);
    return rows;
};

exports.create = async (data) => {
    const { nombre_producto, tipo_producto, descripcion, estatus } = data;
    const query = `
        INSERT INTO producto (nombre_producto, tipo_producto, descripcion, estatus)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre_producto, tipo_producto, descripcion, estatus]);
    return rows[0];
};
