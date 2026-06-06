
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const reportesController = require('../controllers/reportes.controller');
const operacionesController = require('../controllers/operaciones.controller');
const alertasController = require('../controllers/alertas.controller');
const expedienteController = require('../controllers/expediente.controller');
const isAuth = require('../util/is-auth.js');
const checkRol = require('../util/check-rol.js');
const nuevo_expedienteController = require('../controllers/nexpediente.controller');
const bitacoraController = require('../controllers/bitacora.controller.js');
const clientesController = require('../controllers/clientes.controller');


router.get("/Dashboard",isAuth, checkRol('oficial_cumplimiento','auditoria'), dashboardController.index);

router.get("/Alertas",isAuth, checkRol('oficial_cumplimiento','auditoria'), alertasController.index);

router.get("/Operaciones",isAuth, checkRol('oficial_cumplimiento','auditoria'), operacionesController.index);

router.get("/Expediente",isAuth, checkRol('oficial_cumplimiento','auditoria'), expedienteController.index);

router.get("/Expediente/Nuevo", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.nuevo);
router.get("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.actualizarVista);
router.post("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.actualizarExpediente);

router.post("/Expediente/Nuevo", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), nuevo_expedienteController.postNuevoExpediente);
router.get("/Reportes",isAuth, checkRol('oficial_cumplimiento', 'auditoria'), reportesController.index);
router.post("/Reportes",isAuth, checkRol('oficial_cumplimiento', 'auditoria'), reportesController.create);
router.get("/Bitacora",isAuth, checkRol('oficial_cumplimiento','auditoria'), require('../controllers/bitacora.controller.js').index);
router.get("/Clientes", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), clientesController.index);
router.get("/Clientes/consulta/:id", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), clientesController.info);
router.post("/Clientes/consulta/:id/baja", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), clientesController.darDeBaja);

module.exports = router;
