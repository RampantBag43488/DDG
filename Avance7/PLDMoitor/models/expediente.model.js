// Actualiza expediente, cliente, persona_fisica y persona_moral
exports.actualizarExpedienteCompleto = async ({
    id_expediente,
    cliente_id,
    expediente,
    cliente,
    persona_fisica,
    persona_moral
}) => {
    const pool = require('../util/database');
    // Actualizar expediente
    await pool.query(
        `UPDATE expediente SET 
            estatus_expediente = $1,
            tipo_expediente = $2,
            observaciones = $3
        WHERE id_expediente = $4`,
        [
            expediente.estatus_expediente,
            expediente.tipo_expediente,
            expediente.observaciones,
            id_expediente
        ]
    );

    // Actualizar cliente
    await pool.query(
        `UPDATE cliente SET 
            nivel_riesgo = $1,
            id_usuario = $2,
            tipo_persona = $3
        WHERE cliente_id = $4`,
        [
            cliente.nivel_riesgo,
            cliente.id_usuario,
            cliente.tipo_persona,
            cliente_id
        ]
    );

    // Actualizar persona_fisica
    if (persona_fisica) {
        await pool.query(
            `UPDATE persona_fisica SET 
                nombre = $1,
                apellido_paterno = $2,
                apellido_materno = $3,
                genero = $4,
                fecha_nacimiento = $5,
                entidad_federativa_nacimiento = $6,
                pais_nacimiento = $7,
                nacionalidad = $8,
                ocupacion_actividad = $9,
                domicilio = $10,
                telefono = $11,
                correo = $12,
                curp = $13,
                rfc = $14,
                numero_id_fiscal = $15,
                num_serie_firma = $16
            WHERE cliente_id = $17`,
            [
                persona_fisica.nombre,
                persona_fisica.apellido_paterno,
                persona_fisica.apellido_materno,
                persona_fisica.genero,
                persona_fisica.fecha_nacimiento,
                persona_fisica.entidad_federativa_nacimiento,
                persona_fisica.pais_nacimiento,
                persona_fisica.nacionalidad,
                persona_fisica.ocupacion_actividad,
                persona_fisica.domicilio,
                persona_fisica.telefono,
                persona_fisica.correo,
                persona_fisica.curp,
                persona_fisica.rfc,
                persona_fisica.numero_id_fiscal,
                persona_fisica.num_serie_firma,
                cliente_id
            ]
        );
    }

    // Actualizar persona_moral
    if (persona_moral) {
        await pool.query(
            `UPDATE persona_moral SET 
                razon_social = $1,
                giro_mercantil_actividad = $2,
                nacionalidad = $3,
                rfc = $4,
                numero_id_fiscal = $5,
                pais_asigna_id_fiscal = $6,
                num_serie_firma = $7,
                domicilio = $8,
                telefono = $9,
                correo = $10,
                representante_legal = $11,
                fecha_constitucion = $12
            WHERE cliente_id = $13`,
            [
                persona_moral.razon_social,
                persona_moral.giro_mercantil_actividad,
                persona_moral.nacionalidad,
                persona_moral.rfc,
                persona_moral.numero_id_fiscal,
                persona_moral.pais_asigna_id_fiscal,
                persona_moral.num_serie_firma,
                persona_moral.domicilio,
                persona_moral.telefono,
                persona_moral.correo,
                persona_moral.representante_legal,
                persona_moral.fecha_constitucion,
                cliente_id
            ]
        );
    }
};
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
    const {rows} = await pool.query(`
        SELECT 
            e.id_expediente,
            e.cliente_id,
            e.fecha_apertura,
            e.fecha_actualizacion,
            e.estatus_expediente,
            e.tipo_expediente,
            e.observaciones,

            c.tipo_persona,

            pf.nombre,
            pf.apellido_paterno,
            pf.apellido_materno,

            pm.razon_social

        FROM expediente e
        JOIN cliente c 
            ON e.cliente_id = c.cliente_id

        LEFT JOIN persona_fisica pf 
            ON e.cliente_id = pf.cliente_id

        LEFT JOIN persona_moral pm 
            ON e.cliente_id = pm.cliente_id

        ORDER BY e.id_expediente DESC
        LIMIT $1 OFFSET $2`, 
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