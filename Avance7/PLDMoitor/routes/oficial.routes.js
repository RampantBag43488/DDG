const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const operacionesController = require('../controllers/operaciones.controller');
const alertasController = require('../controllers/alertas.controller');
const expedienteController = require('../controllers/expediente.controller');
const isAuth = require('../util/is-auth.js');
const checkRol = require('../util/check-rol.js');

router.get("/",isAuth, checkRol('oficial_cumplimiento'), (req, res) => {
    res.redirect("/oficial/Dashboard");
});

router.get("/Dashboard",isAuth, checkRol('oficial_cumplimiento'), (req, res) => {
    res.render('oc/dashboard/Dashboard');
});

router.get("/Alertas",isAuth, checkRol('oficial_cumplimiento'), alertasController.index);

router.get("/Operaciones",isAuth, checkRol('oficial_cumplimiento'), operacionesController.index);

router.get("/Expediente",isAuth, checkRol('oficial_cumplimiento'), expedienteController.index);

router.get("/Expediente/Nuevo", isAuth, checkRol('oficial_cumplimiento'), expedienteController.nuevo);
router.get("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento'), expedienteController.actualizarVista);
router.post("/Expediente/Actualizar", isAuth, checkRol('oficial_cumplimiento'), expedienteController.actualizarExpediente);

router.get("/Reportes",isAuth, checkRol('oficial_cumplimiento'), reportesController.index);

module.exports = router;