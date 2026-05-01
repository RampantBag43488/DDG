const pool = require('../util/database.js');
const bcrypt = require('bcryptjs');


exports.User = class {
    constructor(nombre,apel_pat,apel_mat,email,contrasena,rol) {
        this.nombre = nombre;
        this.apel_pat = apel_pat;
        this.apel_mat = apel_mat;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol;

    }

    static async findByID(id_usuario){
        const sql = `SELECT id_usuario, nombre, contrasena, rol
            FROM usuarios
            WHERE id_usuario = $1`;
        const {rows} = await pool.query(sql, [id_usuario]);
        return rows[0] || null;
    }
    async save(){
        const hashedPass = await bcrypt.hash(this.contrasena, 12);
        const sql = `INSERT INTO usuarios 
            (nombre, apellido_paterno, apellido_materno, email, contrasena, rol, estatus, fecha_creacion)
            VALUES ($1, $2, $3, $4, $5, $6, 'activo', now())
            RETURNING id_usuario`;
        const {rows } = await pool.query(sql,[
            this.nombre, this.apel_pat, this.apel_mat,
            this.email, hashedPass, this.rol
        ]);
        return rows[0];
    }
};