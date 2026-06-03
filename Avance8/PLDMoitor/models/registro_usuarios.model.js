const pool = require('../util/database');


exports.Usuario = class{
    constructor(nombre, apellido_paterno, apellido_materno, email, contrasena, rol, estatus){
        this.nombre = nombre;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol || 'empleado';
        this.estatus = estatus || 'activo';
    }

    async save (){
        const sql = `INSERT INTO usuarios(nombre, apellido_paterno, apellido_materno, email, contrasena, rol, estatus)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id_usuario`;
        const{rows} = await pool.query(sql,[this.nombre, this.apellido_paterno, this.apellido_materno, this.email, this.contrasena, this.rol, this.estatus]);
        return rows[0];
    }
}



exports.fetchAll = async (page = 1, pageSize = 10) => {
    const offset = (page-1) * pageSize;
    const sql = `SELECT id_usuario, nombre,
    apellido_paterno, apellido_materno, email, rol, 
    estatus, fecha_creacion, fecha_actualizacion
    FROM usuarios
    ORDER BY fecha_creacion DESC, id_usuario DESC
    LIMIT $1 OFFSET $2`;
    const {rows} = await pool.query(sql,[pageSize,offset]);
    return rows;
};

exports.countUsuarios = async () =>{
    const sql = `SELECT COUNT(*) AS total
    FROM usuarios`;

    const {rows} = await pool.query(sql);
    return parseInt(rows[0].total);
}

exports.findById = async(id_usuario) =>{
    const sql = `SELECT id_usuario, nombre,
    apellido_paterno, apellido_materno, email, rol,
     estatus, fecha_creacion, fecha_actualizacion
    FROM usuarios
    WHERE id_usuario = $1`;
    const {rows} = await pool.query(sql,[id_usuario]);
    return rows[0];
}


exports.update = async(id_usuario, usuario) => {
    const sql = `UPDATE usuarios
    SET 
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        email = $4,
        rol = $5,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_usuario = $6
    RETURNING id_usuario`;
    const {rows} = await pool.query(sql,[usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno,
         usuario.email, usuario.rol, id_usuario]); 
    return rows[0];   
};

exports.updateStatus = async(id_usuario) => {
    const sql = `UPDATE usuarios
    SET
        estatus = CASE
            WHEN estatus = 'activo' THEN 'inactivo'
            ELSE 'activo'
            END,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_usuario = $1
    RETURNING id_usuario, estatus`;
    const {rows} = await pool.query(sql,[id_usuario]);
    return rows[0];
}