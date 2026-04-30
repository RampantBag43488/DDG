const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/empleado/Dashboard');
});

router.get('/Dashboard', (req, res) => {
    res.render('empleado/dashboard/Dashboard');
});

router.get('/Reportes', (req, res) => {
    res.render('empleado/reportes/Reportes');
});

router.get('/Expedientes', (req, res) => {
    res.render('empleado/expedientes/Expedientes');
});

router.get('/Transacciones', (req, res) => {
    res.render('empleado/transacciones/Transacciones');
});

module.exports = router;