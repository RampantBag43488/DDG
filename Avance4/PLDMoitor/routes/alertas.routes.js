const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertas.controller');

router.get('/alertas_db', controller.getAlertas);

module.exports = router;