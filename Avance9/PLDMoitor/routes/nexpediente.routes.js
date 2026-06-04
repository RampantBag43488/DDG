const express = require('express');
const router = express.Router();

const nuevo_expedienteController = require('../controllers/nexpediente.controller');


router.post('/nuevo-expediente', nuevo_expedienteController.postNuevoExpediente);