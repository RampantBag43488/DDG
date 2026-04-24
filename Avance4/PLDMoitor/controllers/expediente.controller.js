const model = require('../models/expediente.model');

module.exports.getExpedientes = async (req, res) => {
    const expedientes = await model.getExpedientes();
    res.status(200).json({ total: expedientes});
};