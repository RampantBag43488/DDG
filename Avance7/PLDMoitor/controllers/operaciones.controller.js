const model = require('../models/operaciones.model.js');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const operaciones = await model.fetchAll(page, pageSize);
        const total = await model.countOperaciones();
        const totalPages = Math.ceil(total /pageSize);
        res.render('oc/operaciones/Operaciones',{operaciones, total, page, pageSize, totalPages});
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Operaciones',
            descripcion: `Visualización de operaciones por usuario ${req.session.nombre}`
        });


    }catch(e){
        console.log(e);
        res.status(500).send('Error al cargar operaciones');
    }
};