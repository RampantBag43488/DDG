const toggleButton = document.getElementById('arrow');
const sidebar = document.getElementById('sidebar');
const icon = toggleButton.querySelector('i');
const toogleButtonDown = document.getElementById('arrow_down');

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

    // Aplicar margin-left al contenido
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.marginLeft = sidebarState === 'hidden' ? '80px' : '220px';
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

    // cambiar margin-left del contenido
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.marginLeft = isHidden ? '80px' : '220px';
    }
});

toogleButtonDown.addEventListener('click', () => {
  // Verificar si la ventana ya existe, para desplegarlo o eliminarlo si existe
  let ventanita = document.querySelector('.btn_arrowDown'); 
  if (ventanita) { 
    ventanita.remove();
    return;
  }

  // Crear nueva ventana con elemento div y clase btn_arrowDown
  ventanita = document.createElement('div');
  ventanita.className = 'btn_arrowDown';

  // Agregar botón de cerrar sesión a la ventana
  const btn = document.createElement('button');
  btn.textContent = 'Cerrar sesión';
  btn.addEventListener('click', cerrarSesion);
  ventanita.appendChild(btn);

  // Agregar la ventana
  toogleButtonDown.style.position = 'relative';
  toogleButtonDown.appendChild(ventanita);
});

async function cerrarSesion() {
  await fetch('/logout', { method: 'POST' });
  window.location.href = '/login';
}