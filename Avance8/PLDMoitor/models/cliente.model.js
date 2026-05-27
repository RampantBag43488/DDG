const pool = require('../util/database.js');


exports.fetchAll = async (page = 1, pageSize = 10, search = '', tipo_persona = '') => {
	const offset = (page - 1) * pageSize;
	let query = `
		SELECT c.cliente_id, c.tipo_persona, c.nivel_riesgo,
		CASE 
			WHEN c.tipo_persona ILIKE 'fisica' THEN CONCAT_WS(' ', pf.nombre, pf.apellido_paterno, pf.apellido_materno)
			WHEN c.tipo_persona ILIKE 'moral' THEN pm.razon_social
			ELSE ''
		END AS nombre
		FROM cliente c
		LEFT JOIN persona_fisica pf ON c.cliente_id = pf.cliente_id
		LEFT JOIN persona_moral pm ON c.cliente_id = pm.cliente_id
	`;
	let where = [];
	let params = [];
	if (search && search !== '') {
		where.push(`(
			CAST(c.cliente_id AS TEXT) ILIKE $${params.length + 1} OR
			c.tipo_persona ILIKE $${params.length + 1} OR
			c.nivel_riesgo ILIKE $${params.length + 1} OR
			(pf.nombre || ' ' || pf.apellido_paterno || ' ' || pf.apellido_materno) ILIKE $${params.length + 1} OR
			pm.razon_social ILIKE $${params.length + 1}
		)`);
		params.push(`%${search}%`);
	}
	if (tipo_persona && tipo_persona !== '') {
		where.push(`c.tipo_persona ILIKE $${params.length + 1}`);
		params.push(tipo_persona);
	}
	if (where.length > 0) {
		query += ' WHERE ' + where.join(' AND ');
	}
	query += ' ORDER BY c.cliente_id LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
	params.push(pageSize, offset);
	const { rows } = await pool.query(query, params);
	return rows;
};

exports.countClientesFiltered = async (search = '', tipo_persona = '') => {
	let query = `
		SELECT COUNT(*) AS totalclientes
		FROM cliente c
		LEFT JOIN persona_fisica pf ON c.cliente_id = pf.cliente_id
		LEFT JOIN persona_moral pm ON c.cliente_id = pm.cliente_id
	`;
	let where = [];
	let params = [];
	if (search && search !== '') {
		where.push(`(
			CAST(c.cliente_id AS TEXT) ILIKE $${params.length + 1} OR
			c.tipo_persona ILIKE $${params.length + 1} OR
			c.nivel_riesgo ILIKE $${params.length + 1} OR
			(pf.nombre || ' ' || pf.apellido_paterno || ' ' || pf.apellido_materno) ILIKE $${params.length + 1} OR
			pm.razon_social ILIKE $${params.length + 1}
		)`);
		params.push(`%${search}%`);
	}
	if (tipo_persona && tipo_persona !== '') {
		where.push(`c.tipo_persona ILIKE $${params.length + 1}`);
		params.push(tipo_persona);
	}
	if (where.length > 0) {
		query += ' WHERE ' + where.join(' AND ');
	}
	const { rows } = await pool.query(query, params);
	return parseInt(rows[0].totalclientes, 10);
};

exports.getById = async (cliente_id) => {
	const { rows } = await pool.query('SELECT cliente_id, tipo_persona, nivel_riesgo FROM cliente WHERE cliente_id = $1', [cliente_id]);
	return rows[0];
};
