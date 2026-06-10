const pool = require('../util/database');
const {getByExpediente} = require('../models/documentos.model.js');
module.exports.informacion = async (req, res) => {
    try {
        const id_usuario = req.session.id_usuario;

        const { rows } = await pool.query(
            `SELECT c.tipo_persona, c.cliente_id
             FROM cliente c
             WHERE c.id_usuario = $1`,
            [id_usuario]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).send('No se encontró el cliente asociado a este usuario');
        }

        const tipo_persona = rows[0].tipo_persona;
        const cliente_id = rows[0].cliente_id;

        const { rows: expRows } = await pool.query(
            'SELECT id_expediente FROM expediente WHERE cliente_id = $1',
            [cliente_id]
        );

        const documentos = expRows.length > 0 
            ? await getByExpediente(expRows[0].id_expediente)
            : [];

        res.render('cliente/Informacion', { tipo_persona, documentos, query:req.query });

    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar vista del cliente');
    }
};