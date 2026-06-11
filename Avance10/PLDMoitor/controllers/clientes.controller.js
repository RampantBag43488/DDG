const alertasModel = require('../models/alertas.model');
const operacionesModel = require('../models/operaciones.model');
const personaFisicaModel = require('../models/persona_fisica.model');
const personaMoralModel = require('../models/persona_moral.model');
const modeloCliente = require('../models/cliente.model');
const contratoModel = require('../models/contrato.model');
const registrarBitacora = require('../util/bitacora.js');
const productoModel = require('../models/producto.model');
const documentoModel = require('../models/documentos.model.js');
const evaluarReglasAlerta = require('../util/alertaRules.js');

module.exports.info = async (req, res) => {
    const cliente_id = req.params.id;
    const tab = req.query.tab || 'alertas';
    // Filtros para alertas
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const search = req.query.search || '';
    const riesgo = req.query.riesgo || '';
    const estatus = req.query.estatus || '';
    const fecha = req.query.fecha || '';
    // Filtros para operaciones
    const opPage = parseInt(req.query.page) || 1;
    const opPageSize = 10;
    const opSearch = req.query.op_search || '';
    const opTipo = req.query.op_tipo || '';
    const opFecha = req.query.op_fecha || '';
    // Filtros para contratos
    const contPage = parseInt(req.query.cont_page) || 1;
    const contPageSize = 10;
    const contSearch = req.query.cont_search || '';
    const contEstatus = req.query.cont_estatus || '';
    // Datos del cliente
    const cliente = await modeloCliente.getById(cliente_id);
    let datos = {};
    let nombreCliente = '';
    let avatarIniciales = '';
    if (cliente.tipo_persona && cliente.tipo_persona.toLowerCase() === 'fisica') {
        datos = await personaFisicaModel.getByClienteId(cliente_id);
        nombreCliente = `${datos.nombre || ''} ${datos.apellido_paterno || ''} ${datos.apellido_materno || ''}`.trim();
        avatarIniciales = `${(datos.nombre||'').charAt(0)}${(datos.apellido_paterno||'').charAt(0)}`.toUpperCase();
    } else if (cliente.tipo_persona && cliente.tipo_persona.toLowerCase() === 'moral') {
        datos = await personaMoralModel.getByClienteId(cliente_id);
        nombreCliente = datos.razon_social || '';
        avatarIniciales = (datos.razon_social||'').split(' ').map(p=>p[0]).join('').substring(0,2).toUpperCase();
    }
    // Score de riesgo y operaciones inusuales
    const scoreRiesgo = cliente.nivel_riesgo || 'N/A';
    const scoreBadgeClass = 'badge-score';
    const scoreBadgeText = 'Estable';
    // Alertas recientes (filtros y pager)
    const alertas = await alertasModel.fetchByCliente(cliente_id, page, pageSize, search, riesgo, estatus, fecha);
    const totalAlertas = await alertasModel.countAlertasByCliente(cliente_id, search, riesgo, estatus, fecha);
    const totalPages = Math.max(1, Math.ceil(totalAlertas / pageSize));
    const actividadBadgeClass = alertas.some(a => a.estatus === 'abierta') ? 'badge-inusual' : 'badge-regular';
    const actividadBadgeText = alertas.some(a => a.estatus === 'abierta') ? 'Actividad Inusual' : 'Actividad Regular';
    // Operaciones recientes (filtros y pager)
    const operaciones = await operacionesModel.fetchByCliente(cliente_id, opPage, opPageSize, opSearch, opTipo, opFecha);
    const totalOperaciones = await operacionesModel.countOperacionesByCliente(cliente_id, opSearch, opTipo, opFecha);
    const opTotalPages = Math.max(1, Math.ceil(totalOperaciones / opPageSize));
    // Operaciones inusuales
    const operacionesInusuales = totalAlertas;
    const operacionesBadgeClass = alertas.some(a => a.estatus === 'abierta') ? 'badge-atencion' : 'badge-ok';
    const operacionesBadgeText = alertas.some(a => a.estatus === 'abierta') ? 'Requiere atención' : 'Sin alertas';
    // Contratos (todos, no solo activos)
    const contratos = await contratoModel.fetchByCliente(cliente_id, contPage, contPageSize, contSearch, contEstatus);
    const totalContratos = await contratoModel.countContratosByCliente(cliente_id, contSearch, contEstatus);
    const contTotalPages = Math.max(1, Math.ceil(totalContratos / contPageSize));
    //Documentos del Cliente
    const expediente = await documentoModel.getExpedienteByCliente(cliente_id);
    const documentos = expediente? await documentoModel.getByExpediente(expediente.id_expediente):[];
    // Pager y filtros
    const paginacion = { page, totalPages };
    const filtros = { search, riesgo, estatus, fecha };
    const opPaginacion = { page: opPage, totalPages: opTotalPages };
    const opFiltros = { search: opSearch, tipo: opTipo, fecha: opFecha };
    const contPaginacion = { page: contPage, totalPages: contTotalPages };
    const contFiltros = { search: contSearch, estatus: contEstatus };
    res.render('oc/clientes/Informacion', {
        cliente,
        datos,
        nombreCliente,
        avatarIniciales,
        actividadBadgeClass,
        actividadBadgeText,
        scoreRiesgo,
        scoreBadgeClass,
        scoreBadgeText,
        operacionesInusuales,
        operacionesBadgeClass,
        operacionesBadgeText,
        alertas,
        operaciones,
        documentos,
        contratos,
        tab,
        paginacion,
        filtros,
        opPaginacion,
        opFiltros,
        contPaginacion,
        contFiltros
    });
};

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const tipo_persona = req.query.tipo || '';
        const clientes = await modeloCliente.fetchAll(page, pageSize, search, tipo_persona);
        const total = await modeloCliente.countClientesFiltered(search, tipo_persona);
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/clientes/Clientes', { clientes, total, page, pageSize, totalPages, search, tipo: tipo_persona });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar clientes');
    }
};

// Dar de baja a un cliente (cancelar contratos)
module.exports.darDeBaja = async (req, res) => {
    const cliente_id = req.params.id;
    
    try {
        // Verificar si existen contratos activos
        const tieneContratosActivos = await contratoModel.hasContratosActivos(cliente_id);
        
        if (!tieneContratosActivos) {
            // No hay contratos activos, no se puede dar de baja
            return res.redirect(`/oficial/Clientes/consulta/${cliente_id}?baja=error&mensaje=no_contratos`);
        }
        
        // Realizar la baja del contrato
        await contratoModel.darDeBaja(cliente_id);
        
        // Registrar en bitácora (solo si hay sesión)
        if (req.session && req.session.id_usuario) {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'Dar de baja contrato',
                descripcion: `El usuario ${req.session.nombre || 'desconocido'} dio de baja el contrato del cliente ID: ${cliente_id}`
            });
        }
        
        // Redireccionar con mensaje de éxito
        res.redirect(`/oficial/Clientes/consulta/${cliente_id}?baja=success`);
    } catch (e) {
        console.error('Error al dar de baja:', e);
        res.redirect(`/oficial/Clientes/consulta/${cliente_id}?baja=error`);
    }
};

// Vista para registrar nuevo contrato
module.exports.nuevoContratoVista = async (req, res) => {
    try {
        const cliente_id = req.params.id;
        const cliente = await modeloCliente.getById(cliente_id);
        const productos = await productoModel.fetchAll();

        res.render('oc/clientes/NuevoContrato', {
            cliente,
            productos
        });
    } catch (e) {
        console.error('Error al cargar vista de nuevo contrato:', e);
        res.status(500).send('Error al cargar formulario de contrato');
    }
};

// Registrar nuevo contrato
module.exports.crearContrato = async (req, res) => {
    try {
        const cliente_id = req.params.id;
        const {
            id_producto,
            tipo_contrato,
            folio_contrato,
            fecha_firma,
            fecha_inicio,
            fecha_final,
            monto_autorizado,
            estatus_contrato,
            observaciones
        } = req.body;

        if (
            !id_producto ||
            !tipo_contrato ||
            !folio_contrato ||
            !fecha_firma ||
            !fecha_inicio ||
            !fecha_final ||
            !monto_autorizado ||
            !estatus_contrato
        ) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        if (new Date(fecha_final) < new Date(fecha_inicio)) {
            return res.status(400).send('La fecha final no puede ser menor a la fecha de inicio');
        }

        if (Number(monto_autorizado) <= 0) {
            return res.status(400).send('El monto autorizado debe ser mayor a 0');
        }

        const folioExistente = await contratoModel.findByFolio(folio_contrato);
        if (folioExistente) {
            return res.status(400).send('El folio del contrato ya existe');
        }

        await contratoModel.create({
            cliente_id,
            id_producto,
            tipo_contrato,
            folio_contrato,
            fecha_firma,
            fecha_inicio,
            fecha_final,
            monto_autorizado,
            estatus_contrato,
            observaciones
        });

        if (req.session && req.session.id_usuario) {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'Registrar contrato',
                descripcion: `Se registró un nuevo contrato para el cliente ID: ${cliente_id}`
            });
        }

        res.redirect(`/oficial/Clientes/consulta/${cliente_id}?tab=contratos`);
    } catch (e) {
        console.error('Error al crear contrato:', e);
        res.status(500).send('Error al registrar contrato');
    }
};

// Vista para registrar nueva Operacion
module.exports.nuevaOperacionVista = async (req, res) => {
    try {
        const cliente_id = req.params.id;
        const cliente = await modeloCliente.getById(cliente_id);
        const contratos = await operacionesModel.fetchContratosByCliente(cliente_id);

        res.render('oc/clientes/NuevaOperacion', {
            cliente,
            contratos
        });
    } catch (e) {
        console.error('Error al cargar vista de nueva operación:', e);
        res.status(500).send('Error al cargar formulario de operación');
    }
};

// Registrar nueva Operacion
module.exports.crearOperacion = async (req, res) => {
    try {
        const cliente_id = req.params.id;
        const {
            id_contrato,
            tipo_operacion,
            fecha_operacion,
            monto,
            clasificacion,
            estatus,
            nivel_riesgo,
            observaciones
        } = req.body;

        if (
            !id_contrato ||
            !tipo_operacion ||
            !fecha_operacion ||
            !monto ||
            !clasificacion ||
            !estatus ||
            !nivel_riesgo
        ) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        if (Number(monto) <= 0) {
            return res.status(400).send('El monto debe ser mayor a 0');
        }

        const contratosCliente = await operacionesModel.fetchContratosByCliente(cliente_id);
        const contratoValido = contratosCliente.find(c => String(c.id_contrato) === String(id_contrato));

        if (!contratoValido) {
            return res.status(400).send('El contrato seleccionado no corresponde al cliente');
        }

        const operacionCreada = await operacionesModel.create({
            cliente_id,
            id_contrato,
            tipo_operacion,
            fecha_operacion,
            monto,
            clasificacion,
            estatus,
            nivel_riesgo,
            observaciones
        });

        const contrato = await operacionesModel.findContratoByIdAndCliente(id_contrato, cliente_id);

        const promedioTipo = await operacionesModel.getPromedioMontoPorTipo( cliente_id,
        id_contrato, tipo_operacion, operacionCreada.id_operacion );

        const sameDayCount = await operacionesModel.countSameTypeSameDay( cliente_id, id_contrato,
        tipo_operacion, fecha_operacion, operacionCreada.id_operacion );

        const last24hCount = await operacionesModel.countLast24h( cliente_id, id_contrato,
        fecha_operacion, operacionCreada.id_operacion );

        const alertasGeneradas = evaluarReglasAlerta({ operacion: operacionCreada,
        contrato, promedioTipo, sameDayCount, last24hCount });

        for (const alertaData of alertasGeneradas) {
            const alertaCreada = await alertasModel.create({
                cliente_id,
                id_operacion: operacionCreada.id_operacion,
                tipo_alerta: alertaData.tipo_alerta,
                motivo: alertaData.motivo,
                evidencia_asociada: alertaData.evidencia_asociada,
                estatus: 'abierta'
            });

            if (req.session && req.session.id_usuario) {
                await registrarBitacora({
                    id_usuario: req.session.id_usuario,
                    id_alerta: alertaCreada.id_alerta,
                    accion: 'Generó alerta automática',
                    descripcion: `Se generó la alerta ${alertaCreada.tipo_alerta} para la operación ${operacionCreada.id_operacion}`
                });
            }
        }

        if (req.session && req.session.id_usuario) {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'Registrar operación',
                descripcion: `Se registró una operación para el cliente ID: ${cliente_id}`
            });
        }

        res.redirect(`/oficial/Clientes/consulta/${cliente_id}?tab=operaciones`);
    } catch (e) {
        console.error('Error al crear operación:', e);
        res.status(500).send('Error al registrar operación');
    }
};