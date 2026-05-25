const express = require('express');
const path = require('path');
const controller = require('../controllers/reportes.controller.js');
const router = express.Router();

router.get('/', controller.index);

module.exports = router;