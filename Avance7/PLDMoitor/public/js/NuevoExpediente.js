// Manejo de estado del formulario
const initExpedienteForm = () => {
    const tipoPersonaSelect = document.getElementById('tipoPersona');
    const fields = document.querySelectorAll('#expedienteForm input, #expedienteForm textarea, #expedienteForm select');
    
    // Estado compartido
    const state = {
        currentType: tipoPersonaSelect.value || 'fisica',
        data: {}
    };

    // Obtiene un elemento por ID
    const getField = id => document.getElementById(id);

    // Guarda todos los campos
    const saveState = () => {
        fields.forEach(f => { if (f.id && f.id !== 'tipoPersona') state.data[f.id] = f.value; });
    };

    // Carga todos los campos
    const loadState = () => {
        fields.forEach(f => { if (f.id && f.id !== 'tipoPersona') f.value = state.data[f.id] || ''; });
        // Muestra/oculta campo de empresa
        const empresa = getField('nombreEmpresaGroup');
        if (empresa) empresa.style.display = state.currentType === 'moral' ? 'flex' : 'none';
    };

    // Cambia entre tipos de persona
    tipoPersonaSelect.addEventListener('change', () => {
        const newType = tipoPersonaSelect.value;
        if (newType === state.currentType) return;
        saveState();
        state.currentType = newType;
        state.data.rfc = ''; // Limpia RFC
        loadState();
    });

    // Carga inicial
    loadState();
};

// Ejecuta cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpedienteForm);
} else {
    initExpedienteForm();
}