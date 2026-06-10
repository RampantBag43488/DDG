
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
const productosController = require('../controllers/productos.controller');
const documentoController = require('../controllers/documentos.controller.js');

router.get("/Dashboard",isAuth, checkRol('oficial_cumplimiento','auditoria'), dashboardController.index);

router.get("/Alertas",isAuth, checkRol('oficial_cumplimiento','auditoria'), alertasController.index);
router.get("/Alertas/:id", isAuth, checkRol('oficial_cumplimiento','auditoria'), alertasController.detalle);
router.post("/Alertas/:id/actualizar", isAuth, checkRol('oficial_cumplimiento','auditoria'), alertasController.actualizar);

router.get("/Operaciones",isAuth, checkRol('oficial_cumplimiento','auditoria'), operacionesController.index);

router.get("/Expediente",isAuth, checkRol('oficial_cumplimiento','auditoria'), expedienteController.index);

router.get("/Expediente/Nuevo", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.nuevo);
router.get("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.actualizarVista);
router.post("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento', 'auditoria'), expedienteController.actualizarExpediente);

router.post("/Expediente/Nuevo", isAuth, checkRol('oficial_cumplimiento'), nuevo_expedienteController.postNuevoExpediente);
router.get("/Reportes",isAuth, checkRol('oficial_cumplimiento'), reportesController.index);
router.post("/Reportes",isAuth, checkRol('oficial_cumplimiento'), reportesController.create);
router.get("/Bitacora",isAuth, checkRol('oficial_cumplimiento'), require('../controllers/bitacora.controller.js').index);
router.get("/Clientes", isAuth, checkRol('oficial_cumplimiento'), clientesController.index);
router.get("/Clientes/consulta/:id", isAuth, checkRol('oficial_cumplimiento'), clientesController.info);
router.post("/Clientes/consulta/:id/baja", isAuth, checkRol('oficial_cumplimiento'), clientesController.darDeBaja);
router.get("/Clientes/consulta/:id/contratos/nuevo", isAuth, checkRol('oficial_cumplimiento'), clientesController.nuevoContratoVista);
router.post("/Clientes/consulta/:id/contratos/nuevo", isAuth, checkRol('oficial_cumplimiento'), clientesController.crearContrato);
router.get("/Clientes/consulta/:id/operaciones/nueva", isAuth, checkRol('oficial_cumplimiento'), clientesController.nuevaOperacionVista);
router.post("/Clientes/consulta/:id/operaciones/nueva", isAuth, checkRol('oficial_cumplimiento'), clientesController.crearOperacion);

router.get("/Productos", isAuth, checkRol('oficial_cumplimiento'), productosController.index);
router.get("/Productos/nuevo", isAuth, checkRol('oficial_cumplimiento'), productosController.nuevoVista);
router.post("/Productos/nuevo", isAuth, checkRol('oficial_cumplimiento'), productosController.crear);
router.get("/documentos/:id/signed-url", isAuth, checkRol('oficial_cumplimiento','auditoria'), documentoController.getSignedUrl);

module.exports = router;
