const pool = require('./database.js');

module.exports = async ({ id_usuario, id_alerta = null, accion, descripcion}) => {
    try {
        const sql = `
            INSERT INTO bitacora (id_usuario, id_alerta, accion, descripcion, fecha_hora)
            VALUES ($1, $2, $3, $4, $5)
        `;

        const fecha_hora = new Date();
        await pool.query(sql, [id_usuario, id_alerta, accion, descripcion, fecha_hora]);
    } catch (e) {
        console.error('Error al registrar en bitácora:', e);
    }
};