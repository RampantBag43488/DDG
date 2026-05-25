const model = require('../models/nexpediente.model.js');

exports.postNuevoExpediente = async (req, res) => {
    try {
        const datos = req.body;
        const rol = req.session.rol;

        const limpiarInput = (val) => {
            const target = Array.isArray(val) ? val[0] : val;
            return String(target || '').replace(/[{} "\\,]/g, '').trim();
        };

        // 1. Crear cliente
        const cliente = new model.Cliente(
            'bajo',
            null,
            datos.tipoPersona
        );

        const clienteGuardado = await cliente.save();
        const cliente_id = clienteGuardado.cliente_id;

        // 2. Crear persona física o moral
        if (datos.tipoPersona === 'fisica') {
            const personaFisica = new model.Persona_Fisica(
                cliente_id,
                datos.nombre,
                datos.apellido_paterno,
                datos.apellido_materno,
                datos.genero,
                datos.fecha_nacimiento,
                datos.entidad_federativa_nacimiento,
                datos.pais_nacimiento,
                datos.nacionalidad,
                datos.ocupacion_actividad,
                datos.domicilio,
                datos.telefono,
                datos.correo,
                datos.curp,
                limpiarInput(datos.rfc),
                limpiarInput(datos.numero_id_fiscal),
                limpiarInput(datos.num_serie_firma)
            );

            await personaFisica.save();

        } else if (datos.tipoPersona === 'moral') {
            const personaMoral = new model.PersonaMoral(
                cliente_id,
                datos.razon_social,
                datos.giro_mercantil_actividad,
                datos.nacionalidad,
                limpiarInput(datos.rfc),
                limpiarInput(datos.numero_id_fiscal),
                datos.pais_asigna_id_fiscal,
                limpiarInput(datos.num_serie_firma),
                datos.domicilio,
                datos.telefono,
                datos.correo,
                datos.representante_legal,
                datos.fecha_constitucion
            );

            await personaMoral.save();
        }

        // 3. Crear expediente
        const expediente = new model.Expediente(
            cliente_id,
            datos.estatus_expediente || 'pendiente',
            datos.tipo_expediente,
            datos.observaciones
        );

        await expediente.save();

        if (req.session.rol === 'cliente') {
            return res.redirect('/cliente/Expediente/Nuevo?success=1');
        }

        if (req.session.rol === 'empleado') {
            return res.redirect('/empleado/Expedientes/Nuevo?success=1');
        }

        if (req.session.rol === 'oficial_cumplimiento') {
            return res.redirect('/oficial/Expediente/Nuevo?success=1');
        }
        // fallback por si algo falla
        return res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el expediente');
    }
};