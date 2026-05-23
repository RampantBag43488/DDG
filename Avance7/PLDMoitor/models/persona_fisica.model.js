const pool = require('../util/database');

exports.create = async (data) => {
    const campos = [
        'cliente_id', 'nombre', 'apellido_paterno', 'apellido_materno', 'genero', 'fecha_nacimiento',
        'entidad_federativa_nacimiento', 'pais_nacimiento', 'nacionalidad', 'ocupacion_actividad',
        'domicilio', 'telefono', 'correo', 'curp', 'rfc', 'numero_id_fiscal', 'num_serie_firma'
    ];
    const values = campos.map(campo => data[campo]);
    const { rows } = await pool.query(
        `INSERT INTO persona_fisica (${campos.join(', ')}) VALUES (${campos.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
        values
    );
    return rows[0];
};

exports.update = async (persona_fisica_id, data) => {
    const campos = [
        'nombre', 'apellido_paterno', 'apellido_materno', 'genero', 'fecha_nacimiento',
        'entidad_federativa_nacimiento', 'pais_nacimiento', 'nacionalidad', 'ocupacion_actividad',
        'domicilio', 'telefono', 'correo', 'curp', 'rfc', 'numero_id_fiscal', 'num_serie_firma'
    ];
    const sets = campos.map((campo, i) => `${campo} = $${i + 2}`);
    const values = campos.map(campo => data[campo]);
    await pool.query(
        `UPDATE persona_fisica SET ${sets.join(', ')} WHERE persona_fisica_id = $1`,
        [persona_fisica_id, ...values]
    );
};

exports.getByClienteId = async (cliente_id) => {
    const { rows } = await pool.query('SELECT * FROM persona_fisica WHERE cliente_id = $1', [cliente_id]);
    return rows[0];
};
