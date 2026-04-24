const express = require('express');
const path = require('path');
const controller = require('../controllers/operaciones.controller.js');
const router = express.Router();

router.get('/', controller.getOperaciones);

module.exports = router;