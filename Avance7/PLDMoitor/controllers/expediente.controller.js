const clienteModel = require('../models/cliente.model');
const personaFisicaModel = require('../models/persona_fisica.model');
const personaMoralModel = require('../models/persona_moral.model');

module.exports.actualizarVista = async (req, res) => {
    try {
        const id_expediente = req.query.id_expediente;
        if (!id_expediente) return res.redirect('/oficial/Expediente');
        const expediente = await model.getById(id_expediente);
        if (!expediente) return res.status(404).send('Expediente no encontrado');

        // Obtener datos relacionados
        const cliente = expediente.cliente_id ? await clienteModel.getById(expediente.cliente_id) : {};
        const persona_fisica = expediente.cliente_id ? await personaFisicaModel.getByClienteId(expediente.cliente_id) : {};
        const persona_moral = expediente.cliente_id ? await personaMoralModel.getByClienteId(expediente.cliente_id) : {};

        // Funcion de ayuda para limpiar campos que vengan como arrays o strings corruptos
        const sanitizarCampo = (val) => {
            if (!val) return '';
            // Si es un array real de JS, tomamos el primer elemento no vacío
            let str = Array.isArray(val) ? (val.find(v => v && v !== '') || '') : String(val);
            // Eliminamos llaves, comillas dobles, barras invertidas y espacios, Luego dividimos por coma y tomamos el primer valor real encontrado
            return str.replace(/[{} "\\]/g, '').split(',').find(v => v !== '') || '';
        };

        // Unificar datos
        const datosVista = {
            ...expediente,
            ...cliente,
            ...persona_fisica,
            ...persona_moral
        };

        datosVista.rfc = sanitizarCampo(datosVista.rfc);
        datosVista.numero_id_fiscal = sanitizarCampo(datosVista.numero_id_fiscal);
        datosVista.num_serie_firma = sanitizarCampo(datosVista.num_serie_firma);

        res.render('oc/expediente/ActualizarExpediente', { expediente: datosVista });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expediente');
    }
};

module.exports.actualizarExpediente = async (req, res) => {
    try {
        const id_expediente = req.body.id_expediente;
        if (!id_expediente) return res.redirect('/oficial/Expediente');

        // funcion para limpiar el bug donde hay strings corruptos
        const limpiarInput = (val) => {
            const target = Array.isArray(val) ? val[0] : val;
            return String(target || '').replace(/[{} "\\,]/g, '').trim();
        };

        // Preparar datos para actualización completa
        const cliente_id = req.body.cliente_id;
        const expediente = {
            estatus_expediente: req.body.estatus_expediente,
            tipo_expediente: req.body.tipo_expediente,
            observaciones: req.body.observaciones
        };
        const cliente = {
            nivel_riesgo: req.body.nivel_riesgo && req.body.nivel_riesgo.trim() !== '' ? req.body.nivel_riesgo : 'bajo',
            id_usuario: req.body.id_usuario,
            tipo_persona: req.body.tipo_persona
        };
        // Si es persona física
        let persona_fisica = null;
        if (req.body.tipo_persona === 'fisica') {
            persona_fisica = {
                nombre: req.body.nombre,
                apellido_paterno: req.body.apellido_paterno,
                apellido_materno: req.body.apellido_materno,
                genero: req.body.genero,
                fecha_nacimiento: req.body.fecha_nacimiento,
                entidad_federativa_nacimiento: req.body.entidad_federativa_nacimiento,
                pais_nacimiento: req.body.pais_nacimiento,
                nacionalidad: req.body.nacionalidad,
                ocupacion_actividad: req.body.ocupacion_actividad,
                domicilio: req.body.domicilio,
                telefono: req.body.telefono,
                correo: req.body.correo,
                curp: req.body.curp,
                rfc: limpiarInput(req.body.rfc).substring(0, 13),
                numero_id_fiscal: limpiarInput(req.body.numero_id_fiscal),
                num_serie_firma: limpiarInput(req.body.num_serie_firma)
            };
        }
        // Si es persona moral
        let persona_moral = null;
        if (req.body.tipo_persona === 'moral') {
            persona_moral = {
                razon_social: req.body.razon_social,
                giro_mercantil_actividad: req.body.giro_mercantil_actividad,
                nacionalidad: req.body.nacionalidad,
                rfc: limpiarInput(req.body.rfc).substring(0, 13),
                numero_id_fiscal: limpiarInput(req.body.numero_id_fiscal),
                pais_asigna_id_fiscal: req.body.pais_asigna_id_fiscal,
                num_serie_firma: limpiarInput(req.body.num_serie_firma),
                domicilio: req.body.domicilio,
                telefono: req.body.telefono,
                correo: req.body.correo,
                representante_legal: req.body.representante_legal,
                fecha_constitucion: req.body.fecha_constitucion
            };
        }
        await model.actualizarExpedienteCompleto({
            id_expediente,
            cliente_id,
            expediente,
            cliente,
            persona_fisica,
            persona_moral
        });
        res.redirect('/oficial/Expediente');
    } catch (e) {
        console.log(e);
        // Renderizar la misma vista con un mensaje de error
        const id_expediente = req.body.id_expediente;
        let expediente = {};
        try {
            expediente = await model.getById(id_expediente);
            // Obtener datos relacionados
            const cliente = expediente.cliente_id ? await clienteModel.getById(expediente.cliente_id) : {};
            const persona_fisica = expediente.cliente_id ? await personaFisicaModel.getByClienteId(expediente.cliente_id) : {};
            const persona_moral = expediente.cliente_id ? await personaMoralModel.getByClienteId(expediente.cliente_id) : {};
            expediente = {
                ...expediente,
                ...cliente,
                ...persona_fisica,
                ...persona_moral
            };

            // Función de ayuda local para el catch
            const sanitizarCatch = (val) => {
                if (!val) return '';
                let str = Array.isArray(val) ? (val.find(v => v && v !== '') || '') : String(val);
                return str.replace(/[{} "\\]/g, '').split(',').find(v => v !== '') || '';
            };

            expediente.rfc = sanitizarCatch(expediente.rfc);
            expediente.numero_id_fiscal = sanitizarCatch(expediente.numero_id_fiscal);
            expediente.num_serie_firma = sanitizarCatch(expediente.num_serie_firma);
        } catch {}
        res.render('oc/expediente/ActualizarExpediente', {
            expediente,
            errorMessage: 'Error al actualizar expediente. Verifica los datos e inténtalo de nuevo.'
        });
    }
};
const model = require('../models/expediente.model');
const registrarBitacora = require('../util/bitacora.js');

module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        res.render('oc/expediente/Expediente', { expedientes, total, page, pageSize, totalPages });
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Expedientes',
            descripcion: `Visualización de expedientes por usuario ${req.session.nombre}`
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expedientes');
    }
};

module.exports.nuevo = async (req, res) => {
    res.render('oc/expediente/NuevoExpediente');
    await registrarBitacora({
        id_usuario: req.session.id_usuario,
        accion: 'Creo un Nuevo Expediente',
        descripcion: `Creación de nuevo expediente por usuario ${req.session.nombre}`
    });
};

module.exports.nuevoEmpleado = async (req, res) => {
    res.render('empleado/expedientes/NuevoExpediente');
    await registrarBitacora({
        id_usuario: req.session.id_usuario,
        accion: 'Creo un Nuevo Expediente',
        descripcion: `Creación de nuevo expediente por usuario ${req.session.nombre}`
    });
};

module.exports.indexEmpleado = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const expedientes = await model.fetchAll(page, pageSize);
        const total = await model.countExpedientes();
        const totalPages = Math.ceil(total / pageSize);
        await registrarBitacora({
            id_usuario: req.session.id_usuario,
            accion: 'Visualizó Expedientes',
            descripcion: `Visualización de expedientes por usuario ${req.session.nombre}`
        });
        res.render('empleado/expedientes/Expedientes', { expedientes, total, page, pageSize, totalPages });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Error al cargar expedientes');
    }
};

module.exports.getExpedientes = async (req, res) => {
    const expedientes = await model.getExpedientes();
    res.status(200).json({ total: expedientes});
};