//Control de flujo, parte 1.0 de la tarea
document.getElementById("btnIf").addEventListener("click", () => {
  let edad = 20;
  if (edad >= 18) { //if
    alert("Eres mayor de edad");
  } else {          //else
    alert("Eres menor de edad");
  }
});

document.getElementById("btnSwitch").addEventListener("click", () => {
  let dia = new Date().getDay();
  let nombreDia;
  switch (dia) {   //Switch
    case 0: nombreDia = "Domingo"; break;
    case 1: nombreDia = "Lunes"; break;
    case 2: nombreDia = "Martes"; break;
    case 3: nombreDia = "Miércoles"; break;
    case 4: nombreDia = "Jueves"; break;
    case 5: nombreDia = "Viernes"; break;
    case 6: nombreDia = "Sábado"; break;
  }
  alert("Hoy es " + nombreDia);
});

document.getElementById("btnError").addEventListener("click", () => {
  try { //try 
    let x = y + 10; // y no está definida
  } catch (error) { //catch
    alert("Ocurrió un error: " + error.message); //Error es el objeto de error
    throw error; //Throw
  }
});

//Bucles, parte 1.1 de la tarea
document.getElementById("btnFor").addEventListener("click", () => {
  let texto = "";
  for (let i = 1; i <= 5; i++) { //for
    texto += i + " ";
  }
  alert("Conteo: " + texto);
});

document.getElementById("btnWhile").addEventListener("click", () => {
  let i = 0;
  let resultado = "";
  while (i < 3) { //while
    resultado += `Iteración ${i + 1}\n`;
    i++;
  }
  alert(resultado);
});

document.getElementById("btnDoWhile").addEventListener("click", () => {
  let i = 0;
  let resultado = "";
  //do...while
  do {
    resultado += `Iteración del do while #${i + 1}\n`;
    i++;
  } while (i < 3);

  alert(resultado);
});

//Funciones, parte 1.2 de la tarea
function saludar(nombre) {
  return `Buen día! ${nombre}!`; //Aca definimos la funcion
}

document.getElementById("btnFuncion").addEventListener("click", () => {
  alert(saludar(" Mi nombre es Alejandra Solorzano")); //Aca la llamamos cuando hacemos el saludar y el texto de aca se le envia al nomnbre
});

//Expresiones y operadores, parte de 1.3 de la tarea
document.getElementById("btnAsignacion").addEventListener("click", () => {
  let a = 5;        // asignación
  let b = 10;
  let igual = a == b; // comparación
  alert(`a = ${a}, b = ${b}, ¿a == b? ${igual}`);
});

document.getElementById("btnAritmeticos").addEventListener("click", () => {
  let x = 7, y = 3;
  alert(`x + y = ${x + y}, x - y = ${x - y}, x * y = ${x * y}, x / y = ${x / y}`); //Operadores aritmeticos
});

document.getElementById("btnLogicos").addEventListener("click", () => {
  let verdad = true, falso = false;
  alert(`verdad && falso = ${verdad && falso}, verdad || falso = ${verdad || falso}, !verdad = ${!verdad}`);//Operador logico
});

//Numeros y fechas, parte 1.4 de la tarea
document.getElementById("btnNumber").addEventListener("click", () => {
  let num = Number("123"); //Aca se comvierte un texto en numero por el objeto number
  alert(`Número convertido: ${num} (tipo: ${typeof num})`);
});

document.getElementById("btnMath").addEventListener("click", () => {
  alert(`Math.sqrt(16) = ${Math.sqrt(16)}, Math.round(4.7) = ${Math.round(4.7)}, Math.random() = ${Math.random()}`); //Objeto math
});

document.getElementById("btnDate").addEventListener("click", () => {
  let hoy = new Date(); //objeto date
  alert(`Hoy es: ${hoy.toDateString()} y la hora es: ${hoy.toLocaleTimeString()}`);
});

//Formateo de texto, parte 1.5 de la tarea
document.getElementById("btnCadenas").addEventListener("click", () => {
  let nombre = "mi nombre es Alejandra";
  alert(`Hola ${nombre}, bienvenido!`); // cadena literal
});

document.getElementById("btnString").addEventListener("click", () => {
  let texto = "JavaScript"; //objeto string
  alert(`Longitud: ${texto.length}, Mayúsculas: ${texto.toUpperCase()}`);
});

//Colecciones indexadas, parte 1.6 de la tarea
document.getElementById("btnArreglos").addEventListener("click", () => {
  let frutas = ["Manzana", "Banana", "Cereza"]; //Arreglos
  alert(`Frutas disponibles: Manzana", "Banana", "Cereza\nPrimera fruta: ${frutas[0]}, Total: ${frutas.length}`);
});

document.getElementById("btnArregloTipado").addEventListener("click", () => {
  // Arreglo tipado de enteros de 8 bits
  let edades = new Int8Array([10, 20, 30, 40]);
  let texto = `Edades registradas: ${edades.join(", ")}
Primera edad: ${edades[0]}
Total de edades: ${edades.length}`;

  alert(texto);
});

//DOM, parte 1.7 de la tarea
document.getElementById("btnID").addEventListener("click", () => {
  document.getElementById("demoDOM").style.color = "red"; ///encontrar elemento por id
});

document.getElementById("btnTag").addEventListener("click", () => {
  let parrafos = document.getElementsByTagName("p"); //encontrar por nombre de etiqueta
  alert(`Hay ${parrafos.length} párrafos`);
});

document.getElementById("btnClass").addEventListener("click", () => {
  let secciones = document.getElementsByClassName("section"); //encontrar por nombre de clase
  alert(`Hay ${secciones.length} elementos con clase "section"`);
});

document.getElementById("btnSelector").addEventListener("click", () => {
  let demo = document.querySelector("#demoDOMselector"); //encontrar al primer selector
  demo.textContent = "Texto cambiado con querySelector!";
});

document.getElementById("btnCollection").addEventListener("click", () => {
  let coleccion = document.querySelectorAll("button"); //encontrar todos los selectores
  alert(`Hay ${coleccion.length} botones en la página`);
});

