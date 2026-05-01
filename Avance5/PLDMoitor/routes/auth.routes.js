const express = require('express');
const router = express.Router();
const controller = require('../controllers/login.controller.js');

router.get('/login', controller.render_login);
router.post('/login', controller.do_login);

module.exports = router;