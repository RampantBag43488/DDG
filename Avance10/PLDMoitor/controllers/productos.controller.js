const productoModel = require('../models/producto.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const search = req.query.search || '';
        const tipo = req.query.tipo || '';
        const estatus = req.query.estatus || '';

        const productos = await productoModel.fetchAll(page, pageSize, search, tipo, estatus);
        const total = await productoModel.countProductosFiltered(search, tipo, estatus);
        const totalPages = Math.ceil(total / pageSize);

        res.render('oc/productos/Productos', { 
            productos, 
            total, 
            page, 
            pageSize, 
            totalPages, 
            search, 
            tipo, 
            estatus 
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al cargar productos');
    }
};

module.exports.nuevoVista = async (req, res) => {
    try {
        res.render('oc/productos/NuevoProducto');
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al cargar formulario de producto');
    }
};

module.exports.crear = async (req, res) => {
    try {
        const { nombre_producto, tipo_producto, descripcion, estatus } = req.body;

        // Validación de campos obligatorios
        if (!nombre_producto || !tipo_producto || !descripcion || !estatus) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        // Crear el producto
        const nuevoProducto = await productoModel.create({
            nombre_producto,
            tipo_producto,
            descripcion,
            estatus
        });

        // Registrar en bitácora
        if (req.session && req.session.id_usuario) {
            await registrarBitacora({
                id_usuario: req.session.id_usuario,
                accion: 'Crear producto',
                descripcion: `Se creó el producto "${nombre_producto}" (ID: ${nuevoProducto.id_producto})`
            });
        }

        res.redirect('/oficial/Productos');
    } catch (e) {
        console.error('Error al crear producto:', e);
        res.status(500).send('Error al registrar producto');
    }
};
