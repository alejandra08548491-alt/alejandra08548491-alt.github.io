const vehiculos = {
    Compacto: {
        imagenes: ['Compacto1.png', 'Compacto2.png', 'Compacto3.png'],
        descripciones: [
            'KIA PICANTO, Año 2016',
            'FORD FIESTA ST, Año 2015',
            'PEUGEOT 308, Año 2018'
        ]
    },
    Mediano: {
        imagenes: ['Mediano1.png', 'Mediano2.png', 'Mediano3.png'],
        descripciones: [
            'HONDA CITY CAR, Año 2017',
            'MERCEDES SLS, Año 2015',
            'FORD FIESTA ST, Año 2016'
        ]
    },
    'Todo Terreno': {
        imagenes: ['TodoTerreno1.png', 'TodoTerreno2.png', 'TodoTerreno3.png'],
        descripciones: [
            'TOYOTA FJ CRUISER, Año 2016',
            'TOYOTA Prado, Año 2018',
            'NISSAN JUKE, Año 2017'
        ]
    },
    Familiar: {
        imagenes: ['Familiar1.png', 'Familiar2.png', 'Familiar3.png'],
        descripciones: [
            'TOYOTA SIENNA, Año 2018',
            'DODGE GRAND CARAVANE, Año 2015',
            'HYUNDAI ELANTRA, Año 2016'
        ]
    }
};

let imagenActual = 0;

function mostrarTodo() {
    var tipoSeleccionado = document.getElementById("tipoVehiculo");
    var tipo = tipoSeleccionado.options[tipoSeleccionado.selectedIndex].text;

    imagenActual = 0;

    document.getElementById("img1").src = "images/" + vehiculos[tipo].imagenes[0];
    document.getElementById("img2").src = "images/" + vehiculos[tipo].imagenes[1];
    document.getElementById("img3").src = "images/" + vehiculos[tipo].imagenes[2];

    document.getElementById("imgVista").src = "images/" + vehiculos[tipo].imagenes[0];
    document.getElementById("infTCar").innerHTML = vehiculos[tipo].descripciones[0];
}

function mostrarImagen(numero) {
    var tipoSeleccionado = document.getElementById("tipoVehiculo");
    var tipo = tipoSeleccionado.options[tipoSeleccionado.selectedIndex].text;

    imagenActual = numero - 1;

    document.getElementById("imgVista").src = "images/" + vehiculos[tipo].imagenes[imagenActual];
    document.getElementById("infTCar").innerHTML = vehiculos[tipo].descripciones[imagenActual];
}