const express = require('express');
const router = express.Router();
const controller = require('../controllers/registro_usuarios.controller');
const isAuth = require('../util/is-auth');
const checkRol = require('../util/check-rol');

// Vista
router.get('/usuarios', isAuth, checkRol('gestion'), controller.index);

// Crear
router.get('/usuarios/Registro_Usuarios', isAuth, checkRol('gestion'), controller.nuevo);
router.post('/usuarios/Registro_Usuarios', isAuth, checkRol('gestion'), controller.save);

// Editar
router.get('/usuarios/:id_usuario/Editar_usuario', isAuth, checkRol('gestion'), controller.edit);
router.post('/usuarios/:id_usuario/Editar_usuario', isAuth, checkRol('gestion'), controller.update);

// Estatus
router.post('/usuarios/:id_usuario/cambiarestatus', isAuth, checkRol('gestion'), controller.updateStatus);

module.exports = router;