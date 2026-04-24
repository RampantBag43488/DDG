const toggleButton = document.getElementById('arrow');
const sidebar = document.getElementById('sidebar');
const icon = toggleButton.querySelector('i');

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