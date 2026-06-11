/**
 * Utilidad para actualizar el nivel de riesgo de todos los clientes
 * basado en sus alertas asociadas.
 * 
 * Uso: node util/actualizarRiesgo.js
 */

require('dotenv').config();
const clienteModel = require('../models/cliente.model');

async function actualizarTodosLosRiesgos() {
    try {
        console.log('Iniciando actualización de niveles de riesgo...');
        
        await clienteModel.actualizarNivelesRiesgoTodos();
        
        console.log('✓ Niveles de riesgo actualizados correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error al actualizar niveles de riesgo:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente desde la línea de comandos
if (require.main === module) {
    actualizarTodosLosRiesgos();
}

module.exports = { actualizarTodosLosRiesgos };