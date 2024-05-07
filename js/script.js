document.addEventListener("DOMContentLoaded", function() {
  generarTablero();
  
  var botonResolver = document.getElementById("botonResolver");
  botonResolver.addEventListener("click", resolverSudoku);

  var botonReiniciar = document.getElementById("botonReiniciar");
  botonReiniciar.addEventListener("click", reiniciarSudoku);
});

function generarTablero() {
  var tabla = document.getElementById("sudoku");
  var rompecabezas = generarSudoku();
  
  for (var i = 0; i < 9; i++) {
    var fila = tabla.insertRow();
    for (var j = 0; j < 9; j++) {
      var celda = fila.insertCell();
      if (rompecabezas[i][j] !== 0) {
        celda.textContent = rompecabezas[i][j];
        celda.classList.add("sololectura"); // Agregar clase para celdas solo lectura
      } else {
        celda.setAttribute("contenteditable", true); // Habilitar edición para celdas vacías
        celda.setAttribute("oninput", "verificarCelda(this)");
      }
    }
  }
}

function generarSudoku() {
  var rompecabezas = [];
  for (var i = 0; i < 9; i++) {
    rompecabezas[i] = [];
    for (var j = 0; j < 9; j++) {
      rompecabezas[i][j] = 0;
    }
  }
  llenarSudoku(rompecabezas);
  return rompecabezas;
}

function llenarSudoku(rompecabezas) {
  var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  barajarArray(numeros);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var numIndex = (i * 3 + Math.floor(i / 3) + j) % 9;
      var num = numeros[numIndex];
      if (esValido(rompecabezas, i, j, num)) {
        rompecabezas[i][j] = num;
      }
    }
  }
  eliminarCeldasAleatorias(rompecabezas);
}

function barajarArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function eliminarCeldasAleatorias(rompecabezas) {
  var numEliminar = Math.floor(Math.random() * 10) + 40; 
  for (var k = 0; k < numEliminar; k++) {
    var fila = Math.floor(Math.random() * 9);
    var columna = Math.floor(Math.random() * 9);
    rompecabezas[fila][columna] = 0;
  }
}
function resolverSudoku() {
  var tabla = document.getElementById("sudoku");
  var rompecabezas = [];
  var sudokuCompleto = true; // Variable para verificar si el sudoku está completo
  
  for (var i = 0; i < 9; i++) {
    rompecabezas[i] = [];
    for (var j = 0; j < 9; j++) {
      var celda = tabla.rows[i].cells[j];
      var valor = parseInt(celda.textContent) || 0;
      rompecabezas[i][j] = valor;
      if (valor === 0) {
        sudokuCompleto = false; // Si hay alguna celda vacía, el sudoku no está completo
      }
    }
  }
  
  if (sudokuCompleto) { // Si el sudoku está completo, intenta resolverlo
    if (resolver(rompecabezas)) {
      actualizarTablero(rompecabezas);
      if (esValido(rompecabezas, 0, 0, rompecabezas[0][0])) { // Verificar si el sudoku resuelto es válido
        alert("¡Felicidades! Has ganado el Sudoku.");
      } else {
        alert("El Sudoku resuelto no es válido.");
      }
    } else {
      alert("¡No existe solución para este rompecabezas de Sudoku!");
    }
  } else {
    alert("El sudoku está incompleto. Por favor, llénelo antes de intentar resolverlo.");
  }
}


function verificarSudokuCompleto(rompecabezas) {
  // Verifica si todas las celdas contienen valores válidos
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (rompecabezas[i][j] === 0) {
        return false; // Si hay una celda vacía, el Sudoku no está completo
      }
    }
  }
  return true; // Si no hay celdas vacías, el Sudoku está completo
}


function resolver(rompecabezas) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (rompecabezas[i][j] === 0) {
        for (var num = 1; num <= 9; num++) {
          if (esValido(rompecabezas, i, j, num)) {
            rompecabezas[i][j] = num;
            if (resolver(rompecabezas)) {
              return true;
            }
            rompecabezas[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function esValido(rompecabezas, fila, columna, num) {
  for (var i = 0; i < 9; i++) {
    if (rompecabezas[fila][i] === num || rompecabezas[i][columna] === num || rompecabezas[Math.floor(fila / 3) * 3 + Math.floor(i / 3)][Math.floor(columna / 3) * 3 + i % 3] === num) {
      return false;
    }
  }
  return true;
}

 function verificarCelda(celda) {
    var fila = celda.parentNode.rowIndex;
    var columna = celda.cellIndex;
    var valor = parseInt(celda.textContent);
    
    if (isNaN(valor) || valor < 1 || valor > 9) {
      celda.textContent = "";
      return;
    }
  
    for (var i = 0; i < 9; i++) {
      if (i !== columna && celda.parentNode.parentNode.rows[fila].cells[i].textContent === celda.textContent) {
        celda.classList.add("resaltar");
        return;
      }
    }
  
    for (var j = 0; j < 9; j++) {
      if (j !== fila && celda.parentNode.parentNode.rows[j].cells[columna].textContent === celda.textContent) {
        celda.classList.add("resaltar");
        return;
      }
    }
  
    var filaInicio = Math.floor(fila / 3) * 3;
    var columnaInicio = Math.floor(columna / 3) * 3;
    for (var m = filaInicio; m < filaInicio + 3; m++) {
      for (var n = columnaInicio; n < columnaInicio + 3; n++) {
        if ((m !== fila || n !== columna) && celda.parentNode.parentNode.rows[m].cells[n].textContent === celda.textContent) {
          celda.classList.add("resaltar");
          return;
        }
      }
    }
  
    celda.classList.remove("resaltar");
  }
  
  function reiniciarSudoku() {
    var tabla = document.getElementById("sudoku");
    while (tabla.rows.length > 0) {
      tabla.deleteRow(0);
    }
    generarTablero();
  }

  function verificarCelda(celda) {
    var fila = celda.parentNode.rowIndex;
    var columna = celda.cellIndex;
    var valor = parseInt(celda.textContent);
    
    if (isNaN(valor) || valor < 1 || valor > 9) {
      celda.textContent = "";
      return;
    }
  
    for (var i = 0; i < 9; i++) {
      if (i !== columna && celda.parentNode.parentNode.rows[fila].cells[i].textContent === celda.textContent) {
        celda.classList.add("resaltar");
        return;
      }
    }
  
    for (var j = 0; j < 9; j++) {
      if (j !== fila && celda.parentNode.parentNode.rows[j].cells[columna].textContent === celda.textContent) {
        celda.classList.add("resaltar");
        return;
      }
    }
  
    var filaInicio = Math.floor(fila / 3) * 3;
    var columnaInicio = Math.floor(columna / 3) * 3;
    for (var m = filaInicio; m < filaInicio + 3; m++) {
      for (var n = columnaInicio; n < columnaInicio + 3; n++) {
        if ((m !== fila || n !== columna) && celda.parentNode.parentNode.rows[m].cells[n].textContent === celda.textContent) {
          celda.classList.add("resaltar");
          return;
        }
      }
    }
  
    celda.classList.remove("resaltar");
  }
  
  function reiniciarSudoku() {
    var tabla = document.getElementById("sudoku");
    while (tabla.rows.length > 0) {
      tabla.deleteRow(0);
    }
    generarTablero();
  }
  
  function incrementarPuntuacion() {
    puntuacionJugador++;
    elementoPuntuacionJugador.textContent = puntuacionJugador;
  }

  
  