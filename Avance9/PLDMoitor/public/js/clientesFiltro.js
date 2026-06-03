// Filtro de búsqueda para clientes OC por tipo

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('clientes-filtro-form');
    const searchInput = document.getElementById('cliente-search');
    const tipoSelect = document.getElementById('cliente-tipo');
    if (!form || !searchInput || !tipoSelect) return;
    function submitFiltro() {
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);
        if (tipoSelect.value) params.append('tipo', tipoSelect.value);
        window.location.href = '/oficial/Clientes?' + params.toString();
    }
    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    tipoSelect.addEventListener('change', submitFiltro);
});
