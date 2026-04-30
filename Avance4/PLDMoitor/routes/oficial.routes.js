const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const operacionesController = require('../controllers/operaciones.controller');

router.get("/", (req, res) => {
    res.redirect("/oficial/Dashboard");
});

router.get("/Dashboard", (req, res) => {
    res.render('oc/dashboard/Dashboard');
});

router.get("/Alertas", (req, res) => {
    res.render('oc/alertas/Alertas');

});

router.get("/Operaciones", operacionesController.getOperaciones);

router.get("/Expediente", (req, res) => {
    res.render('oc/expediente/Expediente');
});

router.get("/Reportes", reportesController.index);

module.exports = router;