const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth.js');
const checkRol = require('../util/check-rol.js');
const expedienteController = require('../controllers/expediente.controller');
const reportesController = require('../controllers/reportes.controller');

router.get('/', isAuth, checkRol('empleado'),(req, res) => {
    res.redirect('/empleado/Dashboard');
});

router.get('/Dashboard',isAuth, checkRol('empleado'),(req, res) => {
    res.render('empleado/dashboard/Dashboard');
});

router.get('/Reportes',isAuth, checkRol('empleado'), reportesController.indexEmpleado);
router.post('/Reportes',isAuth, checkRol('empleado'), reportesController.createEmpleado);

router.get('/Expedientes',isAuth, checkRol('empleado'), expedienteController.indexEmpleado);

router.get('/Expedientes/Nuevo', isAuth, checkRol('empleado'), expedienteController.nuevoEmpleado);

router.get('/Transacciones',isAuth, checkRol('empleado'), (req, res) => {
    res.render('empleado/transacciones/Transacciones');
});

module.exports = router;