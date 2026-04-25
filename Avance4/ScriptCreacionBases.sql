Create Table Usuarios(
	id_usuario	SERIAL	PRIMARY KEY,
	nombre	VARCHAR(100)	NOT NULL,
    apellido_paterno    VARCHAR(100)    NOT NULL,
    apellido_materno    VARCHAR(100)	NOT NULL,
	email	VARCHAR(150)	NOT NULL UNIQUE,
	contrasena	VARCHAR(255)	NOT NULL,
	rol		VARCHAR(20)	NOT NULL CHECK (rol IN('empleado','oficial_cumplimiento','auditoria','gestion','cliente')),
	estatus		VARCHAR(20)	NOT NULL DEFAULT 'activo' CHECK (estatus IN('activo','inactivo')),
	ultimo_acceso TIMESTAMP,
	fecha_creacion	TIMESTAMP	NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	
);

Create Table Cliente(
	cliente_id	SERIAL	PRIMARY KEY,
	nombre	VARCHAR(100)	NOT NULL,
	apellido_paterno	VARCHAR(100)	NOT NULL,
	apellido_materno	VARCHAR(100)	NOT NULL,
	nivel_riesgo	VARCHAR(20)	NOT NULL CHECK (nivel_riesgo 	IN('bajo','medio','alto')),
	id_usuario	INTEGER	NULL REFERENCES Usuarios(id_usuario)
);
Create TABLE Expediente(
	id_expediente SERIAL	PRIMARY KEY,
	cliente_id	INTEGER		NOT NULL REFERENCES Cliente(cliente_id),
	actividad	VARCHAR(150)	NOT NULL,
	nombre		VARCHAR(100)	NOT NULL,
	apellido_paterno	VARCHAR(100) NOT NULL,
	apellido_materno	VARCHAR(100) NOT NULL,
	nacionalidad	VARCHAR(50) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	RFC VARCHAR(13)	NOT NULL UNIQUE,
	correo	VARCHAR(150) NOT NULL UNIQUE,
	telefono VARCHAR(20)	NOT NULL,
	domicilio TEXT NOT NULL,
	numero_id_fiscal 	VARCHAR(50) NOT NULL,
	num_serie_firma		VARCHAR(100) NOT NULL
);

Create TABLE Documento(
	id_documento SERIAL	PRIMARY KEY,
	id_expediente INTEGER NOT NULL REFERENCES Expediente(id_expediente),
	tipo_documento VARCHAR(100) NOT NULL,
	nombre_archivo VARCHAR(100) NOT NULL,
	ruta_archivo TEXT NOT NULL,
	fecha_carga TIMESTAMP NOT NULL
);

Create TABLE Sesion(
	id_sesion	SERIAL	PRIMARY KEY,
	id_usuario INTEGER NOT NULL REFERENCES Usuarios(id_usuario),
	activa BOOLEAN	NOT NULL DEFAULT TRUE,
	fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fecha_final TIMESTAMP,
	CONSTRAINT checar_fechas_sesion check(fecha_final is NULL or fecha_final >= fecha_inicio)
);

Create TABLE Producto(
	id_producto SERIAL	PRIMARY KEY,
	nombre_producto VARCHAR(100) NOT NULL UNIQUE,
	tipo_producto VARCHAR(100) NOT NULL,
	descripcion TEXT NOT NULL,
	estatus VARCHAR(20) NOT NULL DEFAULT'activo' CHECK (estatus IN ('activo','inactivo')),
	fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

Create TABLE Contrato(
	id_contrato SERIAL PRIMARY KEY,
	cliente_id INTEGER NOT NULL REFERENCES Cliente(cliente_id),
	id_producto INTEGER NOT NULL REFERENCES Producto(id_producto),
	tipo_contrato VARCHAR(50) NOT NULL,
	folio_contrato VARCHAR(30) NOT NULL UNIQUE,
	fecha_firma TIMESTAMP NOT NULL,
	fecha_inicio DATE NOT NULL,
	fecha_final DATE NOT NULL,
	monto_autorizado NUMERIC NOT NULL CHECK (monto_autorizado > 0),
	estatus_contrato VARCHAR(40) NOT NULL CHECK (estatus_contrato IN ('vigente','vencido','cancelado','en revision')),
	observaciones TEXT,
  CONSTRAINT chk_fechas_contrato CHECK (fecha_final >= fecha_inicio)
);

Create TABLE Operaciones(
	id_operacion SERIAL PRIMARY KEY,
	cliente_id INTEGER NOT NULL REFERENCES Cliente(cliente_id),
	id_contrato INTEGER NOT NULL REFERENCES Contrato(id_contrato),
	tipo_operacion VARCHAR(50) NOT NULL,
	fecha_operacion TIMESTAMP NOT NULL,
	monto NUMERIC NOT NULL CHECK (monto > 0),
	clasificacion VARCHAR(30) NOT NULL,
  estatus VARCHAR(30) NOT NULL CHECK(estatus IN('pendiente','aprobada','rechazada')),
	nivel_riesgo VARCHAR (20) NOT NULL CHECK (nivel_riesgo IN('bajo','medio','alto')),
	observaciones TEXT 
);

Create TABLE Alertas(
	id_alerta SERIAL PRIMARY KEY,
	cliente_id INTEGER NOT NULL REFERENCES Cliente(cliente_id),
	id_operacion INTEGER NOT NULL REFERENCES Operaciones(id_operacion),
	tipo_alerta VARCHAR(50) NOT NULL,
	motivo TEXT NOT NULL,
	evidencia_asociada TEXT ,
	fecha_generacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	estatus VARCHAR(30) NOT NULL CHECK (estatus IN ('abierta','cerrada','en revision')),
	fecha_cierre TIMESTAMP,
  CONSTRAINT chk_cierre_alerta CHECK(
    (estatus IN('abierta','en revision') AND fecha_cierre is NULL )OR (estatus IN('cerrada')AND fecha_cierre is NOT NULL)
  )
);

Create TABLE Reportes(
	id_reporte SERIAL PRIMARY KEY,
	acusado VARCHAR(200) NOT NULL,
	fecha_generacion DATE NOT NULL DEFAULT CURRENT_DATE,
	descripcion TEXT NOT NULL,
	evidencia_adjunta TEXT NOT NULL,
	estatus VARCHAR(20) NOT NULL DEFAULT 'borrador' CHECK (estatus IN('borrador', 'enviado','archivado')),
	formato_salida VARCHAR(30) NOT NULL CHECK (formato_salida IN('PDF','Word','CSV','XML'))
	
);

Create TABLE Bitacora(
	id_bitacora SERIAL PRIMARY KEY,
	id_usuario INTEGER REFERENCES Usuarios(id_usuario) NOT NULL,
	id_alerta INTEGER REFERENCES Alertas(id_alerta),
	accion	VARCHAR(30) NOT NULL,
	descripcion	TEXT NOT NULL,
	fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LISTA_RIESGO(
  id_lista SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100) NOT NULL,
  nivel_riesgo VARCHAR(20) NOT NULL CHECK(nivel_riesgo IN('bajo','medio','alto')),
  motivo TEXT NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);