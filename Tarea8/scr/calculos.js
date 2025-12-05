function MensajeTipoSeguro() {
    const seguroSelect = document.getElementById('seguro');
    const tipoSeguro = seguroSelect.options[seguroSelect.selectedIndex].id;

    let mensaje = '';

    switch (tipoSeguro) {
        case 'PBO':
            mensaje = 'Protección Básica Obligatoria (PBO)\n\n' +
                'Cubre daños al vehículo rentado y daños a vehículos terceros involucrados en un accidente de tránsito.\n\n' +
                'Costo de alquiler diario: $5.45 por día.';
            break;
        case 'PED':
            mensaje = 'Protección Extendida de Daños (PED)\n\n' +
                'Cubre la Protección Básica Obligatoria (PBO) más daños a propiedades de terceros, incendio e inundaciones.\n\n' +
                'Costo de alquiler diario: $9.50 por día.';
            break;
        case 'PGM':
            mensaje = 'Protección Gasto Médicos (PGM)\n\n' +
                'Cubre la Protección Extendida de Daños (PED) más gastos médicos para los ocupantes del vehículo.\n\n' +
                'Costo de alquiler diario: $11.25 por día.';
            break;
    }

    alert(mensaje);
}

function calcularDias(fechaRetiro, fechaDevolucion) {
    const fecha1 = new Date(fechaRetiro);
    const fecha2 = new Date(fechaDevolucion);
    const diferencia = fecha2 - fecha1;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    return dias;
}

async function obtenerRegionPais(cca3) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${cca3}`);
        const pais = await response.json();
        return pais[0].region;
    } catch (error) {
        console.error('Error al obtener región:', error);
        return null;
    }
}

async function calcular() {
    const fechaRetiro = document.querySelector('input[name="fechaRetiro"]').value;
    const fechaDevolucion = document.querySelector('input[name="fechadevolucion"]').value;
    const tipoVehiculo = document.getElementById('tipoVehiculo');
    const seguro = document.getElementById('seguro');
    const nacionalidad = document.getElementById('nacionalidad');

    if (!fechaRetiro || !fechaDevolucion) {
        alert('Por favor seleccione ambas fechas');
        return;
    }

    const dias = calcularDias(fechaRetiro, fechaDevolucion);

    if (dias < 3 || dias > 365) {
        alert('Los días no son correctos. La renta debe ser entre 3 y 365 días.');
        return;
    }

    document.querySelector('input[name="dias"]').value = dias;

    const tarifaVehiculo = parseFloat(tipoVehiculo.value);
    const tarifaSeguro = parseFloat(seguro.value);

    let tarifaDiaria = tarifaVehiculo + tarifaSeguro;

    if (dias > 30 && dias < 120) {
        tarifaDiaria = tarifaDiaria * 0.85;
    } else if (dias >= 120 && dias <= 365) {
        tarifaDiaria = tarifaDiaria * 0.75;
    }

    document.querySelector('input[name="td"]').value = tarifaDiaria.toFixed(2);

    const cca3 = nacionalidad.value;
    const region = await obtenerRegionPais(cca3);

    let descuento = 0;
    if (region === 'Americas' || region === 'Europe') {
        descuento = 0.10;
    } else if (region === 'Africa') {
        descuento = 0.05;
    }

    const totalPagar = (tarifaDiaria * dias) - ((tarifaDiaria * dias) * descuento);

    document.querySelector('input[name="totalPagar"]').value = totalPagar.toFixed(2);
}

function guardar() {
    const fechaRetiro = document.querySelector('input[name="fechaRetiro"]').value;
    const fechaDevolucion = document.querySelector('input[name="fechadevolucion"]').value;
    const dias = document.querySelector('input[name="dias"]').value;
    const tarifaDiaria = document.querySelector('input[name="td"]').value;
    const totalPagar = document.querySelector('input[name="totalPagar"]').value;
    const tipoVehiculo = document.getElementById('tipoVehiculo').selectedIndex;
    const seguro = document.getElementById('seguro').selectedIndex;
    const nacionalidad = document.getElementById('nacionalidad').value;

    const cotizacion = {
        fechaRetiro,
        fechaDevolucion,
        dias,
        tarifaDiaria,
        totalPagar,
        tipoVehiculo,
        seguro,
        nacionalidad
    };

    localStorage.setItem('ultimaCotizacion', JSON.stringify(cotizacion));
    localStorage.setItem('paisSeleccionado', nacionalidad);

    alert('Cotización guardada exitosamente');
}

function cargarUltimaCotizacion() {
    const cotizacion = localStorage.getItem('ultimaCotizacion');

    if (cotizacion) {
        const datos = JSON.parse(cotizacion);

        document.querySelector('input[name="fechaRetiro"]').value = datos.fechaRetiro;
        document.querySelector('input[name="fechadevolucion"]').value = datos.fechaDevolucion;
        document.querySelector('input[name="dias"]').value = datos.dias;
        document.querySelector('input[name="td"]').value = datos.tarifaDiaria;
        document.querySelector('input[name="totalPagar"]').value = datos.totalPagar;
        document.getElementById('tipoVehiculo').selectedIndex = datos.tipoVehiculo;
        document.getElementById('seguro').selectedIndex = datos.seguro;

    }
}
window.addEventListener('load', () => {
    const btnCalcular = document.querySelector('input[type="button"][value="Calcular"]');
    const btnGuardar = document.querySelector('input[type="button"][value="Guardar"]');

    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcular);
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', guardar);
    }
    cargarUltimaCotizacion();
});