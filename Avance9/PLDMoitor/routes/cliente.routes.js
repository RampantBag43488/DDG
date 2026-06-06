const express = require('express');
const router = express.Router();
const controller = require('../controllers/cliente.controller.js');
const checkRol = require('../util/check-rol.js'); // o como lo tengas

router.get('/Informacion', checkRol('cliente'), controller.informacion);

module.exports = router;