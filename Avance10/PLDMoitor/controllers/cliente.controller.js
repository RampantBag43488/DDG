const pool = require('../util/database');

module.exports.informacion = async (req, res) => {
    try {
        const id_usuario = req.session.id_usuario;

        const { rows } = await pool.query(
            `SELECT c.tipo_persona 
             FROM cliente c
             WHERE c.id_usuario = $1`,
            [id_usuario]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).send('No se encontró el cliente asociado a este usuario');
        }

        const tipo_persona = rows[0].tipo_persona;

        res.render('cliente/Informacion', { tipo_persona });

    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar vista del cliente');
    }
};