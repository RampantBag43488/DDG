/**
 * Funcionalidad de visibilidad de contraseña para la página de inicio de sesión
 */
document.addEventListener('DOMContentLoaded', function() {
  const passwordToggle = document.querySelector('.password-toggle');
  const passwordInput = document.querySelector('.password-container input');

  if (!passwordToggle || !passwordInput) return;

  const eyeIcon = passwordToggle.querySelector('i');

  passwordToggle.addEventListener('click', function() {
    // Alternar visibilidad de contraseña
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

    // Actualizar icono y atributos de accesibilidad
    if (isPassword) {
      // Mostrar contraseña - cambiar a icono de ojo tachado
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
      passwordToggle.setAttribute('aria-label', 'Ocultar contraseña');
      passwordToggle.setAttribute('title', 'Ocultar contraseña');
    } else {
      // Ocultar contraseña - volver al icono de ojo
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
      passwordToggle.setAttribute('aria-label', 'Mostrar contraseña');
      passwordToggle.setAttribute('title', 'Mostrar contraseña');
    }

    // Mantener el foco en el input de contraseña para mejor experiencia
    passwordInput.focus();
  });
});