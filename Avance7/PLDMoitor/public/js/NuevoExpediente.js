const initExpedienteForm = () => {
    const tipoPersonaSelect = document.getElementById('tipoPersona');
    const form = document.getElementById('expedienteForm');

    if (!tipoPersonaSelect || !form) return;

    const camposFisica = document.getElementById('camposFisica');
    const camposMoral = document.getElementById('camposMoral');

    const fields = form.querySelectorAll('input, textarea, select');

    const state = {
        currentType: tipoPersonaSelect.value || 'fisica',
        data: {}
    };

    // Guarda datos
    const saveState = () => {
        fields.forEach(field => {
            if (field.id && field.id !== 'tipoPersona') {
                state.data[field.id] = field.value;
            }
        });
    };

    // Activa/desactiva required
    const setRequired = (container, active) => {
        if (!container) return;

        const inputs = container.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.required = active;
        });
    };

    // Muestra/oculta secciones
    const toggleFields = () => {
        if (state.currentType === 'fisica') {
            camposFisica.style.display = 'block';
            camposMoral.style.display = 'none';

            setRequired(camposFisica, true);
            setRequired(camposMoral, false);
        } else {
            camposFisica.style.display = 'none';
            camposMoral.style.display = 'block';

            setRequired(camposFisica, false);
            setRequired(camposMoral, true);
        }
    };

    // Carga datos guardados
    const loadState = () => {
        fields.forEach(field => {
            if (field.id && field.id !== 'tipoPersona') {
                field.value = state.data[field.id] || '';
            }
        });

        toggleFields();
    };

    // Evento cambio de tipo
    tipoPersonaSelect.addEventListener('change', () => {
        const newType = tipoPersonaSelect.value;

        if (newType === state.currentType) return;

        saveState();
        state.currentType = newType;


        loadState();
    });

    loadState();

   const params = new URLSearchParams(window.location.search);

    if (params.get('success') === '1') {
    alert('Expediente guardado correctamente');
    window.history.replaceState({}, document.title, window.location.pathname);
    } 
};

// Ejecutar cuando cargue
document.addEventListener('DOMContentLoaded', initExpedienteForm);