const model = require('../models/registro_usuarios.model.js');
const bcrypt = require('bcrypt');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        const usuarios = await model.fetchAll(page, pageSize);
        const total = await model.countUsuarios();
        const totalPage = Math.ceil(total / pageSize);

        res.render('admin/usuarios/Usuarios', {
            usuarios,
            page,
            pageSize,
            total,
            totalPage
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar usuarios');
    }
};


module.exports.nuevo = (req,res) =>{
    res.render('admin/usuarios/Registro_usuarios');
};

module.exports.save = async (req,res) =>{
    try{
        const datos = req.body;
        const hashed = await bcrypt.hash(datos.contrasena, 10);
        const usuario = new model.Usuario(
            datos.nombre, datos.apellido_paterno, datos.apellido_materno,
            datos.email, hashed, datos.rol
        );
        await usuario.save();

        res.redirect('/admin/usuarios?success=1');
    }catch(e){
        console.log(e);
        res.status(500).send('Error al crear usuario');
    }
};

module.exports.edit = async(req,res) =>{
    try{
        const usuario = await model.findById(req.params.id_usuario);
        res.render('admin/usuarios/Editar_usuario',{usuario});
    }catch(e){
        console.log(e);
        res.status(500).send('Error al cargar usuario');
    }
};

module.exports.update = async (req,res) =>{
    try{
        await model.update(req.params.id_usuario, req.body);
        res.redirect('/admin/usuarios?success=1');
    }catch(e){
        console.log(e);
        res.status(500).send('Error al actualizar usuario');
    }
};

module.exports.updateStatus = async (req, res) => {
    try { 
        await model.updateStatus(req.params.id_usuario);

        res.redirect('/admin/usuarios?success=1');

    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cambiar estatus');
    }
};