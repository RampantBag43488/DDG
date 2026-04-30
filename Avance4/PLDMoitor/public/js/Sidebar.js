const toggleButton = document.getElementById('arrow');
const sidebar = document.getElementById('sidebar');
const icon = toggleButton.querySelector('i');

// Función para restaurar el estado del sidebar
function restoreSidebarState() {
    // Obtener estado del localStorage
    const sidebarState = localStorage.getItem('sidebar');
    // Aplicar estado al sidebar
    if (sidebarState === 'hidden') {
        sidebar.classList.add('hide');
        icon.classList.remove('fa-caret-left');
        icon.classList.add('fa-caret-right');
    } else {
        sidebar.classList.remove('hide');
        icon.classList.remove('fa-caret-right');
        icon.classList.add('fa-caret-left');
    }
}

// Restaurar estado al cargar la página
document.addEventListener('DOMContentLoaded', restoreSidebarState);

// funcion para el boton de toggle del sidebar
toggleButton.addEventListener('click', () => {

    sidebar.classList.toggle('hide');

    const isHidden = sidebar.classList.contains('hide');

    // guardar estado
    localStorage.setItem('sidebar', isHidden ? 'hidden' : 'open');

    // cambiar icono
    if (isHidden) {
        icon.classList.remove('fa-caret-left');
        icon.classList.add('fa-caret-right');
    } else {
        icon.classList.remove('fa-caret-right');
        icon.classList.add('fa-caret-left');
    }
});