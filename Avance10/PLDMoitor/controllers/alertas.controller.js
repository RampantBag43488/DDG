const model = require('../models/alertas.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const alertas = await model.fetchAll(page, pageSize, search, status);
        const total = await model.countAlertasFiltered(search, status);
        const totalPages = Math.ceil(total / pageSize);
        
        // Get alert counts by status for summary cards
        const statusCounts = await model.countByStatus();
        
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó alertas',
            descripcion: `Visualización de la página de alertas por el usuario ${req.session.nombre}`
        });
        res.render('oc/alertas/Alertas', { 
            alertas, 
            total, 
            page, 
            pageSize, 
            totalPages, 
            search, 
            status,
            statusCounts 
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar alertas');
    }
};

module.exports.getAlertas = async (req, res) => {
    const alertas = await model.getAlertas();
    res.status(200).json({ total: alertas});
};

// Mostrar detalle de una alerta
module.exports.detalle = async (req, res) => {
    try {
        const id_alerta = parseInt(req.params.id);
        const alerta = await model.findById(id_alerta);
        
        if (!alerta) {
            return res.status(404).render('oc/alertas/Alertas', { 
                error: 'Alerta no encontrada',
                alertas: [],
                total: 0,
                page: 1,
                pageSize: 10,
                totalPages: 0,
                search: '',
                status: ''
            });
        }
        
        // Determinar la URL de regreso según el origen
        const from = req.query.from || 'alertas';
        const cliente_id = req.query.cliente_id || '';
        let volverUrl = '/oficial/Alertas'; // Default fallback
        
        if (from === 'cliente' && cliente_id) {
            // Return to the client consultation page
            volverUrl = `/oficial/Clientes/consulta/${cliente_id}?tab=alertas`;
        }
        // Para alertas desde la página principal de alertas, volverá a esa pagina
        
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó detalle de alerta',
            descripcion: `El usuario ${req.session.nombre} visualizó la alerta ${id_alerta}`
        });
        
        res.render('oc/alertas/DetalleAlerta', { alerta, volverUrl, from, cliente_id });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar la alerta');
    }
};

// Actualizar alerta
module.exports.actualizar = async (req, res) => {
    try {
        const id_alerta = parseInt(req.params.id);
        const { estatus, from, cliente_id } = req.body;
        
        await model.updateAlerta(id_alerta, estatus);
        
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Actualizó alerta',
            descripcion: `El usuario ${req.session.nombre} actualizó la alerta ${id_alerta} con estatus: ${estatus}`
        });
        
        // Preserve the navigation context (from and cliente_id) after update
        const redirectFrom = from || 'alertas';
        
        let redirectUrl = `/oficial/Alertas/${id_alerta}?from=${redirectFrom}`;
        if (redirectFrom === 'cliente' && cliente_id) {
            redirectUrl += `&cliente_id=${cliente_id}`;
        }
        
        res.redirect(redirectUrl);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al actualizar la alerta');
    }
};
