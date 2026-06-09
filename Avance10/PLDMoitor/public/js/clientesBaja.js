// Script para manejar la funcionalidad de "Dar de baja" en la vista de cliente
document.addEventListener('DOMContentLoaded', function() {
        const btnBaja = document.getElementById('btnBaja');
        const modalBaja = document.getElementById('modalBaja');
        const cancelarBaja = document.getElementById('cancelarBaja');
        const confirmarBaja = document.getElementById('confirmarBaja');
        const formBaja = document.getElementById('formBaja');
        
        // Mostrar modal al hacer click en "Dar de baja"
        if (btnBaja && modalBaja) {
            btnBaja.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                modalBaja.style.display = 'flex';
            });
        }
        
        // Cerrar modal al hacer click en "Cancelar"
        if (cancelarBaja && modalBaja) {
            cancelarBaja.addEventListener('click', function() {
                modalBaja.style.display = 'none';
            });
        }
        
        // Confirmar y enviar formulario
        if (confirmarBaja && formBaja) {
            confirmarBaja.addEventListener('click', function() {
                formBaja.submit();
            });
        }
        
        // Manejar mensajes de éxito/error desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const bajaStatus = urlParams.get('baja');
        const mensaje = urlParams.get('mensaje');
        
        if (bajaStatus === 'success') {
            alert('Contrato dado de baja exitosamente.');
            // Limpiar parámetros de la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (bajaStatus === 'error') {
            if (mensaje === 'no_contratos') {
                alert('No se puede dar de baja: El cliente no tiene contratos activos.');
            } else {
                alert('Error al dar de baja el contrato. Intente nuevamente.');
            }
            // Limpiar parámetros de la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });