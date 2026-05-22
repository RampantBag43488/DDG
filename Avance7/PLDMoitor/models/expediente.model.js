exports.getById = async (id_expediente) => {
    const { rows } = await pool.query('SELECT * FROM expediente WHERE id_expediente = $1', [id_expediente]);
    return rows[0];
};

exports.updateExpediente = async (id_expediente, data) => {
    // Solo los campos que existen en expediente
    const campos = [
        'cliente_id',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_apertura',
        'fecha_actualizacion',
        'estatus_expediente',
        'tipo_expediente',
        'observaciones'
    ];
    const sets = campos.map((campo, i) => `${campo} = $${i + 2}`);
    const values = campos.map(campo => data[campo]);
    await pool.query(
        `UPDATE expediente SET ${sets.join(', ')} WHERE id_expediente = $1`,
        [id_expediente, ...values]
    );
};
const pool = require('../util/database');

exports.fetchAll = async (page = 1, pageSize = 5) => {
    const offset = (page - 1) * pageSize;
    const {rows} = await pool.query(
        'SELECT * FROM expediente ORDER BY id_expediente LIMIT $1 OFFSET $2', 
        [pageSize, offset]
    );
    return rows;
};

exports.countExpedientes = async () => {
    const {rows} = await pool.query('SELECT COUNT(*) AS totalexpedientes FROM expediente');
    return rows[0].totalexpedientes;
};

exports.getExpedientes = async () => {
    const{ rows } = await pool.query('SELECT * FROM expediente');
    return rows;
};