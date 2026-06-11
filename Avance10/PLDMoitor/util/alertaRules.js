function normalizarTexto(texto = '') {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

module.exports = function evaluarReglasAlerta({ operacion, contrato, promedioTipo = 0,
    sameDayCount = 0, last24hCount = 0 }) {
    const alertas = [];

    const monto = Number(operacion.monto || 0);
    const montoAutorizado = Number(contrato?.monto_autorizado || 0);
    const tipoOperacion = normalizarTexto(operacion.tipo_operacion || '');
    const fechaOperacion = new Date(operacion.fecha_operacion);
    const hora = fechaOperacion.getHours();

    const fueraDeHorario = hora < 6 || hora >= 22;
    const montoAltoVsContrato = montoAutorizado > 0 && monto >= montoAutorizado * 0.8;
    const montoExcedeContrato = montoAutorizado > 0 && monto > montoAutorizado;
    const montoAltoVsPromedio = Number(promedioTipo) > 0 && monto >= Number(promedioTipo) * 1.5;

    // Monto elevado
    if (montoAltoVsContrato || montoAltoVsPromedio) {
        alertas.push({
            tipo_alerta: 'Monto elevado',
            motivo: montoAltoVsContrato
                ? 'La operación supera el 80% del monto autorizado del contrato.'
                : 'La operación supera en 50% el promedio histórico del cliente para este tipo de operación.',
            evidencia_asociada: null
        });
    }

    // Retiro elevado
    if (tipoOperacion.includes('retiro') && ((montoAutorizado > 0 && monto >= montoAutorizado * 0.4) ||
        montoAltoVsPromedio)) {
        alertas.push({
            tipo_alerta: 'Retiro elevado',
            motivo: (montoAutorizado > 0 && monto >= montoAutorizado * 0.4)
                ? 'El retiro supera el 40% del monto autorizado del contrato.'
                : 'El retiro supera en 50% el promedio histórico de retiros del cliente.',
            evidencia_asociada: null
        });
    }

    // Retiro inusual
    if (tipoOperacion.includes('retiro') && (fueraDeHorario || sameDayCount >= 3)) {
        alertas.push({
            tipo_alerta: 'Retiro inusual',
            motivo: fueraDeHorario
                ? 'Retiro fuera del horario operativo permitido.'
                : 'Frecuencia atípica de retiros en un mismo día.',
            evidencia_asociada: null
        });
    }

    // Depósito inusual
    if ((tipoOperacion.includes('deposito') || tipoOperacion.includes('depósito')) &&
    (fueraDeHorario || sameDayCount >= 3)) {
        alertas.push({
            tipo_alerta: 'Depósito inusual',
            motivo: fueraDeHorario
                ? 'Depósito fuera del horario operativo permitido.'
                : 'Frecuencia atípica de depósitos en un mismo día.',
            evidencia_asociada: null
        });
    }

    // Operación inusual
    if (last24hCount >= 5 || (sameDayCount >= 3 && montoAutorizado > 0 && monto <= montoAutorizado * 0.1)) {
        alertas.push({
            tipo_alerta: 'Operación inusual',
            motivo: last24hCount >= 5
                ? 'Frecuencia operativa atípica en las últimas 24 horas.'
                : 'Múltiples operaciones de bajo monto en un mismo día.',
            evidencia_asociada: null
        });
    }

    // Actividad sospechosa
    if (montoExcedeContrato || alertas.length >= 2) {
        alertas.push({
            tipo_alerta: 'Actividad sospechosa',
            motivo: montoExcedeContrato
                ? 'La operación excede el monto autorizado del contrato.'
                : 'La operación activó múltiples condiciones de riesgo.',
            evidencia_asociada: null
        });
    }

    return alertas;
};