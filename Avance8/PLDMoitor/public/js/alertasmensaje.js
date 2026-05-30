const params = new URLSearchParams(window.location.search);

    if (params.get('success') === '1') {
    alert('Los chicos 67 dicen: Mensaje guardado correctamente');
    window.history.replaceState({}, document.title, window.location.pathname);
    }