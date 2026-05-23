
const pool = require('../util/database');

exports.Cliente = class {
    constructor(nivel_riesgo, id_usuario, tipo_persona){
        this.nivel_riesgo = nivel_riesgo || 'bajo';
        this.id_usuario = id_usuario;
        this.tipo_persona = tipo_persona;
    }

    async save() {
    const sql = `INSERT INTO cliente (nivel_riesgo, id_usuario, tipo_persona) VALUES ($1,$2,$3)
     RETURNING cliente_id`;
     const {rows} = await pool.query(sql,[this.nivel_riesgo, this.id_usuario, this.tipo_persona]);
     return rows[0];
    }
};

exports.Persona_Fisica = class {
    constructor(cliente_id, nombre, apellido_paterno, apellido_materno, genero, 
        fecha_nacimiento, entidad_federativa_nacimiento, 
        pais_nacimiento, nacionalidad, ocupacion_actividad, domicilio, telefono, 
        correo, curp, rfc, numero_id_fiscal, num_serie_firma){
        this.cliente_id = cliente_id;
        this.nombre = nombre;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.genero = genero;
        this.fecha_nacimiento = fecha_nacimiento;
        this.entidad_federativa_nacimiento = entidad_federativa_nacimiento;
        this.pais_nacimiento = pais_nacimiento;
        this.nacionalidad = nacionalidad;
        this.ocupacion_actividad = ocupacion_actividad;
        this.domicilio = domicilio;
        this.telefono = telefono;
        this.correo = correo;
        this.curp = curp;
        this.rfc = rfc;
        this.numero_id_fiscal = numero_id_fiscal;
        this.num_serie_firma = num_serie_firma;
    }

    async save(){
        const sql = `INSERT INTO persona_fisica(cliente_id,nombre,
        apellido_paterno, apellido_materno, genero, fecha_nacimiento, 
        entidad_federativa_nacimiento, pais_nacimiento, nacionalidad,
        ocupacion_actividad, domicilio, telefono, correo, curp, rfc,
        numero_id_fiscal, num_serie_firma) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING persona_fisica_id`;
        const {rows} = await pool.query(sql,[this.cliente_id,this.nombre,this.apellido_paterno,this.apellido_materno, this.genero, this.fecha_nacimiento,
            this.entidad_federativa_nacimiento, this.pais_nacimiento, this.nacionalidad, this.ocupacion_actividad,
            this.domicilio, this.telefono, this.correo, this.curp, this.rfc, this.numero_id_fiscal, this.num_serie_firma
        ]);
        return rows[0];
    }
};


exports.PersonaMoral = class {
    constructor(cliente_id, razon_social, giro_mercantil_actividad, nacionalidad, rfc, numero_id_fiscal, pais_asigna_id_fiscal,
        num_serie_firma, domicilio, telefono, correo, representante_legal,fecha_constitucion){
            this.cliente_id = cliente_id;
            this.razon_social = razon_social;
            this.giro_mercantil_actividad = giro_mercantil_actividad;
            this.nacionalidad = nacionalidad;
            this.rfc = rfc;
            this.numero_id_fiscal = numero_id_fiscal;
            this.pais_asigna_id_fiscal = pais_asigna_id_fiscal;
            this.num_serie_firma = num_serie_firma;
            this.domicilio = domicilio;
            this.telefono = telefono;
            this.correo = correo;
            this.representante_legal = representante_legal;
            this.fecha_constitucion = fecha_constitucion;
        }


        async save(){
        const sql = `INSERT INTO persona_moral(cliente_id,razon_social,giro_mercantil_actividad, nacionalidad, rfc, 
        numero_id_fiscal, pais_asigna_id_fiscal, num_serie_firma, domicilio, telefono, correo, representante_legal, fecha_constitucion)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING persona_moral_id`;
        const {rows} = await pool.query(sql,[this.cliente_id,this.razon_social,this.giro_mercantil_actividad,this.nacionalidad,this.rfc,
            this.numero_id_fiscal,this.pais_asigna_id_fiscal,this.num_serie_firma,this.domicilio,this.telefono,this.correo,
            this.representante_legal,this.fecha_constitucion
        ]);
        return rows[0];
    }
};

exports.Expediente = class{
    constructor(cliente_id,estatus_expediente, tipo_expediente, observaciones){
        this.cliente_id = cliente_id;
        this.estatus_expediente = estatus_expediente || 'abiertol';
        this.tipo_expediente = tipo_expediente;
        this.observaciones = observaciones;
    }
    
    async save(){
        const sql = `INSERT into expediente(
        cliente_id, estatus_expediente, tipo_expediente,
        observaciones) VALUES($1,$2,$3,$4)
        RETURNING id_expediente`;
        const {rows} = await pool.query(sql,[this.cliente_id,this.estatus_expediente,
            this.tipo_expediente, this.observaciones
        ]);
        return rows[0];
    }
}

