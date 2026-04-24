const model = require('../models/operaciones.model.js');

module.exports.getOperaciones = async (req,res)=>{
    try{
        const operaciones = await model.getOperaciones();
        res.render('oc/operaciones/Operaciones',{operaciones});
    }catch(e){
        console.log(e);
        res.status(500).send('Error al cargar operaciones');
    }
};