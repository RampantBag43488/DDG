// Filtro de búsqueda y estatus para reportes (empleado y OC)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportes-filtro-form');
    const searchInput = document.getElementById('reporte-search');
    const statusSelect = document.getElementById('reporte-status');
    if (!form || !searchInput || !statusSelect) return;
    function submitFiltro() {
        const params = new URLSearchParams(); // Parámetros para la consulta
        if (searchInput.value) params.append('search', searchInput.value); // Agregar el valor de busqueda si existe
        if (statusSelect.value) params.append('status', statusSelect.value); // Agregar el valor de estatus si existe
        // Detecta si es OC o empleado por la URL
        let base = window.location.pathname.includes('/empleado/') ? '/empleado/Reportes' : '/reportes';
        window.location.href = base + '?' + params.toString(); 
    }
    // Enviar filtros al backend al cambiar al presionar Enter
    searchInput.addEventListener('change', submitFiltro);
    searchInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') submitFiltro(); });
    statusSelect.addEventListener('change', submitFiltro); 
});
