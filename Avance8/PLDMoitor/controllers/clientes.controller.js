const alertasModel = require('../models/alertas.model');
const operacionesModel = require('../models/operaciones.model');
const personaFisicaModel = require('../models/persona_fisica.model');
const personaMoralModel = require('../models/persona_moral.model');
const modeloCliente = require('../models/cliente.model');
const contratoModel = require('../models/contrato.model');
const registrarBitacora = require('../util/bitacora.js');

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
