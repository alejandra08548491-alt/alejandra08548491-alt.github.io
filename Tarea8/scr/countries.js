async function cargarPaises() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const paises = await response.json();

        const selectNacionalidad = document.getElementById('nacionalidad');

        selectNacionalidad.innerHTML = '';

        paises.sort((a, b) => {
            const nombreA = a.name.common || '';
            const nombreB = b.name.common || '';
            return nombreA.localeCompare(nombreB);
        });

        paises.forEach(pais => {
            if (pais.cca3 && pais.name && pais.name.common) {
                const option = document.createElement('option');
                option.value = pais.cca3;
                option.textContent = pais.name.common;
                selectNacionalidad.appendChild(option);
            }
        });

        const paisGuardado = localStorage.getItem('paisSeleccionado');
        if (paisGuardado) {
            selectNacionalidad.value = paisGuardado;
        } else {
            selectNacionalidad.value = 'CRI';
        }

    } catch (error) {
        console.error('Error detallado al cargar los países:', error);

        cargarPaisesManual();
    }
}

function cargarPaisesManual() {
    const selectNacionalidad = document.getElementById('nacionalidad');
    selectNacionalidad.innerHTML = '';

    const paisesBasicos = [
        { cca3: 'CRI', nombre: 'Costa Rica' },
        { cca3: 'USA', nombre: 'United States' },
        { cca3: 'MEX', nombre: 'Mexico' },
        { cca3: 'CAN', nombre: 'Canada' },
        { cca3: 'PAN', nombre: 'Panama' },
        { cca3: 'GTM', nombre: 'Guatemala' },
        { cca3: 'NIC', nombre: 'Nicaragua' },
        { cca3: 'SLV', nombre: 'El Salvador' },
        { cca3: 'HND', nombre: 'Honduras' },
        { cca3: 'ESP', nombre: 'Spain' },
        { cca3: 'COL', nombre: 'Colombia' },
        { cca3: 'ARG', nombre: 'Argentina' },
        { cca3: 'BRA', nombre: 'Brazil' },
        { cca3: 'CHL', nombre: 'Chile' },
        { cca3: 'PER', nombre: 'Peru' }
    ];

    paisesBasicos.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.cca3;
        option.textContent = pais.nombre;
        selectNacionalidad.appendChild(option);
    });

    const paisGuardado = localStorage.getItem('paisSeleccionado');
    selectNacionalidad.value = paisGuardado || 'CRI';

    console.log('Se cargó la lista de respaldo de países');
}

window.addEventListener('load', cargarPaises);