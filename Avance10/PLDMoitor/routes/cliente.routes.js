const express = require('express');
const router = express.Router();
const controller = require('../controllers/cliente.controller.js');
const checkRol = require('../util/check-rol.js'); // o como lo tengas
const documentoController = require('../controllers/documentos.controller.js');

router.get('/Informacion', checkRol('cliente'), controller.informacion);
router.post('/documentos', checkRol('cliente'), documentoController.subirDocumentos);

module.exports = router;