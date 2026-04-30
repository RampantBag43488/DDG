const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const operacionesController = require('../controllers/operaciones.controller');
const alertasController = require('../controllers/alertas.controller');
const expedienteController = require('../controllers/expediente.controller');

router.get("/", (req, res) => {
    res.redirect("/oficial/Dashboard");
});

router.get("/Dashboard", (req, res) => {
    res.render('oc/dashboard/Dashboard');
});

router.get("/Alertas", alertasController.index);

router.get("/Operaciones", operacionesController.index);

router.get("/Expediente", expedienteController.index);

router.get("/Reportes", reportesController.index);

module.exports = router;