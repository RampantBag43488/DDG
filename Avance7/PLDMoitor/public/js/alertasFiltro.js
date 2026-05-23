// Enviar filtros al backend al cambiar
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('alertas-filtro-form');
    const searchInput = document.getElementById('alerta-search');
    const statusSelect = document.getElementById('alerta-status');
    if (!form || !searchInput || !statusSelect) return;
    function submitFiltro() {
        const params = new URLSearchParams();
        if (searchInput.value) params.append('search', searchInput.value);// Agregar el valor de busqueda si existe
        if (statusSelect.value) params.append('status', statusSelect.value);// Agregar el valor de estatus si existe
        window.location.href = '/oficial/Alertas?' + params.toString();
    }
    //Enviar filtros al backend al cambiar al presionar Enter
    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    statusSelect.addEventListener('change', submitFiltro);
});