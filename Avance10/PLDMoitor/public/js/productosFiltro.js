// Filtro de búsqueda para productos OC

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productos-filtro-form');
    const searchInput = document.getElementById('producto-search');
    const tipoSelect = document.getElementById('producto-tipo');
    const estatusSelect = document.getElementById('producto-estatus');
    if (!form || !searchInput || !tipoSelect || !estatusSelect) return;

    function submitFiltro() {
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);
        if (tipoSelect.value) params.append('tipo', tipoSelect.value);
        if (estatusSelect.value) params.append('estatus', estatusSelect.value);
        window.location.href = '/oficial/Productos?' + params.toString();
    }

    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    tipoSelect.addEventListener('change', submitFiltro);
    estatusSelect.addEventListener('change', submitFiltro);
});