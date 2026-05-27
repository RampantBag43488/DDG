const alertasModel = require('../models/alertas.model');
const operacionesModel = require('../models/operaciones.model');
const personaFisicaModel = require('../models/persona_fisica.model');
const personaMoralModel = require('../models/persona_moral.model');
const model = require('../models/cliente.model');

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
    // Datos básicos del cliente
    const cliente = await model.getById(cliente_id);
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
    // Pager y filtros
    const paginacion = { page, totalPages };
    const filtros = { search, riesgo, estatus, fecha };
    const opPaginacion = { page: opPage, totalPages: opTotalPages };
    const opFiltros = { search: opSearch, tipo: opTipo, fecha: opFecha };
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
        tab,
        paginacion,
        filtros,
        opPaginacion,
        opFiltros
    });
};

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const tipo_persona = req.query.tipo || '';
        const clientes = await model.fetchAll(page, pageSize, search, tipo_persona);
        const total = await model.countClientesFiltered(search, tipo_persona);
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/clientes/Clientes', { clientes, total, page, pageSize, totalPages, search, tipo: tipo_persona });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar clientes');
    }
};
