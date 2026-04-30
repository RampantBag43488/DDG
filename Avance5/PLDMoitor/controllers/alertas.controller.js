const model = require('../models/alertas.model');

module.exports.getAlertas = async (req, res) => {
    const alertas = await model.getAlertas();
    res.status(200).json({ total: alertas});
};