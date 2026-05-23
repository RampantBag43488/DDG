// Filtro de búsqueda para operaciones OC por tipo y fecha
// Similar a reportesFiltro.js y alertasFiltro.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('operaciones-filtro-form');
    const searchInput = document.getElementById('operacion-search');
    const tipoSelect = document.getElementById('operacion-tipo');
    const fechaInput = document.getElementById('operacion-fecha');
    if (!form || !searchInput || !tipoSelect || !fechaInput) return;
    function submitFiltro() {
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);
        if (tipoSelect.value) params.append('tipo', tipoSelect.value);
        if (fechaInput.value) params.append('fecha', fechaInput.value);
        window.location.href = '/oficial/Operaciones?' + params.toString();
    }
    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    tipoSelect.addEventListener('change', submitFiltro);
    fechaInput.addEventListener('change', submitFiltro);
    fechaInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
});
