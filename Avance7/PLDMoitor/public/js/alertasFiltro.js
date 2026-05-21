// Enviar filtros al backend al cambiar
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('alertas-filtro-form');
    const searchInput = document.getElementById('alerta-search');
    const statusSelect = document.getElementById('alerta-status');
    if (!form || !searchInput || !statusSelect) return;
    function submitFiltro() {
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);
        if (statusSelect.value) params.append('status', statusSelect.value);
        window.location.href = '/oficial/Alertas?' + params.toString();
    }
    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    statusSelect.addEventListener('change', submitFiltro);
});