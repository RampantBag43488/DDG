const pool = require('../util/database');

// Insertar documento después de subirlo a Storage
exports.Nuevodoc = class Nuevodoc{
    constructor(id_expediente, tipo_documento, nombre, ruta_archivo, bucket, mime_type, size_bytes, subido_por, estatus = 'pendiente'){
        this.id_expediente = id_expediente;
        this.tipo_documento = tipo_documento;
        this.nombre_archivo = nombre;
        this.ruta_archivo = ruta_archivo;
        this.bucket = bucket;
        this.mime_type = mime_type;
        this.size_bytes = size_bytes;
        this.subido_por = subido_por;
        this.estatus = estatus;
    
    }
    async save() {
        const sql = `
            INSERT INTO documento (id_expediente, tipo_documento, nombre_archivo, ruta_archivo, bucket, mime_type, size_bytes, subido_por, estatus)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const { rows } = await pool.query(sql, [this.id_expediente, this.tipo_documento, this.nombre_archivo, this.ruta_archivo, this.bucket, this.mime_type, this.size_bytes, this.subido_por, this.estatus]);
        return rows[0];
    }
}

// Obtener documentos de un expediente
exports.getByExpediente = async (id_expediente) => {
  const { rows } = await pool.query(
    'SELECT * FROM documento WHERE id_expediente = $1 ORDER BY fecha_carga DESC',
    [id_expediente]
  );
  return rows;
};

exports.getClienteByUsuario = async (id_usuario) => {
  const { rows } = await pool.query(
    'SELECT cliente_id, tipo_persona FROM cliente WHERE id_usuario = $1',
    [id_usuario]
  );
  return rows[0];
};

exports.getExpedienteByCliente = async (cliente_id) => {
  const { rows } = await pool.query(
    'SELECT id_expediente FROM expediente WHERE cliente_id = $1',
    [cliente_id]
  );
  return rows[0];
};

exports.getById = async (id_documento) => {
  const { rows } = await pool.query(
    'SELECT * FROM documento WHERE id_documento = $1',
    [id_documento]
  );
  return rows[0];
};