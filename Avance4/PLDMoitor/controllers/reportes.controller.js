const model = require('../models/reportes.model.js');

module.exports.getReportes = async (req,res)=>{
    try{
        const reportes = await model.getReportes();
        res.render('oc/reportes/Reportes',{reportes});
    }catch(e){
        console.log(e);
        res.status(500).send('Error al cargar reportes');
    }
};