const alertasModel = require('../models/alertas.model');
const clienteModel = require('../models/cliente.model');
const expedienteModel = require('../models/expediente.model');
const operacionesModel = require('../models/operaciones.model');
const reportesModel = require('../models/reportes.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        // Obtener totales para stats
        const totalAlertas = await alertasModel.countAlertas();
        const totalClientes = await clienteModel.countClientesFiltered();
        const totalExpedientes = await expedienteModel.countExpedientes();
        const totalOperaciones = parseInt(await operacionesModel.countOperacionesFiltered(), 10) || 0;
        const totalReportes = parseInt(await reportesModel.countReportesFiltered(), 10) || 0;

        // Obtener registros recientes (últimos 5 de cada tipo)
        const alertasRecientes = await alertasModel.fetchAll(1, 5, '', '');
        const operacionesRecientes = await operacionesModel.fetchAll(1, 5, '', '', '');
        const reportesRecientes = await reportesModel.fetchAll(1, 5, '', '');

        // Stats de operaciones (para pager simulado)
        const operacionesTotal = totalOperaciones;
        const operacionesPageSize = 5;
        const operacionesTotalPages = Math.ceil(operacionesTotal / operacionesPageSize);

        // Stats de alertas (para pager simulado)
        const alertasTotal = totalAlertas;
        const alertasPageSize = 5;
        const alertasTotalPages = Math.ceil(alertasTotal / alertasPageSize);

        // Stats de reportes (para pager simulado)
        const reportesTotal = totalReportes;
        const reportesPageSize = 5;
        const reportesTotalPages = Math.ceil(reportesTotal / reportesPageSize);

        // Objeto con los datos para la vista
        const dashboardData = {
            stats: {
                totalAlertas,
                totalClientes,
                totalExpedientes,
                totalOperaciones,
                totalReportes
            },
            // Datos para tablas
            alertas: alertasRecientes,
            operaciones: operacionesRecientes,
            reportes: reportesRecientes,
            // Stats para pagers
            alertasTotal,
            alertasPageSize,
            alertasTotalPages,
            operacionesTotal,
            operacionesPageSize,
            operacionesTotalPages,
            reportesTotal,
            reportesPageSize,
            reportesTotalPages
        };

        // Registrar en bitacora
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó dashboard',
            descripcion: `Visualización del dashboard por el usuario ${req.session.nombre}`
        });

        res.render('oc/dashboard/Dashboard', dashboardData);
    } catch (e) {
        console.error('Error en dashboard:', e);
        res.status(500).send('Error al cargar el dashboard');
    }
};