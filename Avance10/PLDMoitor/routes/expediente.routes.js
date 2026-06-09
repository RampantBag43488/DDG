const express = require('express');
const router = express.Router();
const controller = require('../controllers/expediente.controller');

router.get('/expedientes_db', controller.getExpedientes);

module.exports = router;