document.getElementById('rol').addEventListener('change', function() {
    const campoCliente = document.getElementById('campo-cliente');
    if (this.value === 'cliente') {
            campoCliente.style.display = 'block';
            document.getElementById('id_cliente').required = true;
    } else {
            campoCliente.style.display = 'none';
            document.getElementById('id_cliente').required = false;
    }
});