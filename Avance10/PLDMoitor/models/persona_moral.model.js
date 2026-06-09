const pool = require('../util/database');

exports.create = async (data) => {
    const campos = [
        'cliente_id', 'razon_social', 'giro_mercantil_actividad', 'nacionalidad', 'rfc',
        'numero_id_fiscal', 'pais_asigna_id_fiscal', 'num_serie_firma', 'domicilio',
        'telefono', 'correo', 'representante_legal'
    ];
    const values = campos.map(campo => data[campo]);
    const { rows } = await pool.query(
        `INSERT INTO persona_moral (${campos.join(', ')}) VALUES (${campos.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
        values
    );
    return rows[0];
};

exports.update = async (persona_moral_id, data) => {
    const campos = [
        'razon_social', 'giro_mercantil_actividad', 'nacionalidad', 'rfc',
        'numero_id_fiscal', 'pais_asigna_id_fiscal', 'num_serie_firma', 'domicilio',
        'telefono', 'correo', 'representante_legal'
    ];
    const sets = campos.map((campo, i) => `${campo} = $${i + 2}`);
    const values = campos.map(campo => data[campo]);
    await pool.query(
        `UPDATE persona_moral SET ${sets.join(', ')} WHERE persona_moral_id = $1`,
        [persona_moral_id, ...values]
    );
};

exports.getByClienteId = async (cliente_id) => {
    const { rows } = await pool.query('SELECT * FROM persona_moral WHERE cliente_id = $1', [cliente_id]);
    return rows[0];
};
