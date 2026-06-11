const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const supabase = require('../util/storage');
const model = require('../models/documentos.model.js');
const pool = require('../util/database.js')

const BUCKET = process.env.PRIVATE_BUCKET;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
  { name: 'identificacion_personal', maxCount: 1 },
  { name: 'comprobante_domicilio', maxCount: 1 },
  { name: 'carta_poder', maxCount: 1 },
  { name: 'rfc', maxCount: 1 },
  { name: 'pasaporte', maxCount: 1 },
  { name: 'testimonio_instrumento', maxCount: 1 },
  { name: 'escrito_firmado', maxCount: 1 },
  { name: 'cedula_fiscal', maxCount: 1 },
  { name: 'doc_identificacion_fiscal', maxCount: 1 },
  { name: 'poderes_representante', maxCount: 1 },
  { name: 'cnbv_datos', maxCount: 1 },
  { name: 'estructura_accionaria', maxCount: 1 },
]);

exports.subirDocumentos = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error multer:', err);
      return res.status(500).send('Error al procesar archivos');
    }

    try {
      const cliente = await model.getClienteByUsuario(req.session.id_usuario);
      if (!cliente) return res.status(404).send('Cliente no encontrado');

      const expediente = await model.getExpedienteByCliente(cliente.cliente_id);
      if (!expediente) return res.status(404).send('Expediente no encontrado');

      const id_expediente = expediente.id_expediente;

      const archivos = req.files;
      if (!archivos || Object.keys(archivos).length === 0) {
        return res.status(400).send('No se subió ningún archivo');
      }
      for (const tipo_documento of Object.keys(archivos)) {
            const file = archivos[tipo_documento][0];

            if (file.mimetype === 'application/pdf') {
                const ext = path.extname(file.originalname).toLowerCase();
                const uuid = crypto.randomUUID();
                const filePath = `expedientes/${id_expediente}/${uuid}-${tipo_documento}${ext}`;

                const { error: storageError } = await supabase.storage
                .from(BUCKET)
                .upload(filePath, file.buffer, { contentType: file.mimetype });

                if (!storageError) {
                const doc = new model.Nuevodoc(
                    id_expediente,
                    tipo_documento,
                    file.originalname,
                    filePath,
                    BUCKET,
                    file.mimetype,
                    file.size,
                    req.session.id_usuario
                );
                await doc.save();
                } else {
                console.error(`Error subiendo ${tipo_documento}:`, storageError.message);
                }
            }
        }
      const totalSubidos = Object.keys(archivos).length;
        // contar cuantos eran pdf
        let subidos = 0;
        for (const tipo of Object.keys(archivos)) {
        if (archivos[tipo][0].mimetype === 'application/pdf') subidos++;
        }

        if (subidos === 0) {
        return res.status(400).send('Solo se aceptan archivos PDF');
        }
      await pool.query(
        "UPDATE usuarios SET estatus = 'inactivo' WHERE id_usuario = $1",
        [req.session.id_usuario]
      );
      req.session.destroy();
      res.render('cliente/exito');
    } catch (e) {
      console.error('Error general:', e);
      res.status(500).send('Error del servidor');
    }
  });
};

exports.getSignedUrl = async (req, res) => {
  try {
    const doc = await model.getById(req.params.id);
    if (!doc) return res.status(404).send('Documento no encontrado');

    const { data, error } = await supabase.storage
      .from(doc.bucket)
      .createSignedUrl(doc.ruta_archivo, 60);

    if (error) return res.status(500).send('Error al generar URL');

    res.redirect(data.signedUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error del servidor');
  }
};