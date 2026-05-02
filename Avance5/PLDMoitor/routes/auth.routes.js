const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller.js');

router.get('/login', controller.render_login);
router.post('/login', controller.do_login);
router.post('/logout', controller.do_logout);

module.exports = router;