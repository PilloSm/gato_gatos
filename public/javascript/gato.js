let socket = io();
var dasd = '';
let panelesGanados = [];
var turno = '';
var wtf = true;

const colorNaranja = '#ffd700';
const colorRosa = '#ffb6c1';
const colorCyan = '#00ffff';
const colorWhite = '#ffffff';
const colorRed = '#ff0000';

var botonesOcupados = [];
var botones = [];

let winCondition = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
function obtenerDigito(cadena) {
  var asd = parseInt(cadena);
  var columna = 0;

  while (!(asd % 10 == 0)) {
    columna++;
    asd--;
  }
  return {
    panel: asd,
    column: columna
  };
}
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  var contenido = '';
  // Crear el tablero
  for (let i = 10; i < 100; i += 10) {
    const miniBoard = document.createElement('div');
    miniBoard.classList.add('mini-board');
    miniBoard.dataset.index = (i / 10);
    gameContainer.appendChild(miniBoard);

    for (let j = 1; j < 10; j++) {
      var uwunt = (i + j);
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = (uwunt);
      cell.dataset.index = j;
      miniBoard.appendChild(cell);
      botones.push({
        id: i + j,
        activo: true
      });
      cell.addEventListener('click', () => {
        var id = parseInt(cell.id);
        console.log(botonesOcupados);
        if (botonesOcupados.includes(id)) {
          return;
        } else {
          var celda = document.getElementById(`${id}`);
          contenido = celda.textContent || celda.innerText;
          var { panel, column } = obtenerDigito(id);
          bailarLaMacarena(panel, column, true, contenido);
          socket.emit('enviarDatos', {
            panel: panel,
            posicion: column
          });
          botonesOcupados.push(id);
        }

      });
    }
  }
  reiniciarTablero();
});
function reiniciarTablero() {
  for (let i = 10; i < 100; i += 10) {
    for (let j = 1; j < 10; j++) {
      var w = (i + j);
      document.getElementById(`${w}`).style.backgroundColor = colorCyan;
      document.getElementById(`${w}`).innerHTML = '';
    }
  }
  botonesOcupados = [];
  miArray = [];
}

function bailarLaMacarena(panel, posicion, pantalla, texto) {
  var w = (panel + posicion);
  var cell = document.getElementById(`${w}`);
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      botonesOcupados.push((i*10) + j);
    }
  }
  if (texto == '') {
    cell.style.backgroundColor = colorRed;
    if (!pantalla) {
      if (turno == 'X') {
        cell.textContent = "O";
      } else if (turno == 'O') {
        cell.textContent = "X";
      }
      if (!checkForWinner(panel, pantalla)) {
        nextMove(posicion);
      }
    } else if (pantalla) {
      cell.textContent = `${turno}`;
      if (!checkForWinner(panel, pantalla)) {
      }
    }
  }
}

function checkForWinner(panel, frame) {
  for (let i = 0; i < winCondition.length; i++) {
    var a = panel + winCondition[i][0];
    var b = panel + winCondition[i][1];
    var c = panel + winCondition[i][2];
    if (document.getElementById(`${a}`).textContent == document.getElementById(`${b}`).textContent && document.getElementById(`${b}`).textContent == document.getElementById(`${c}`).textContent && (document.getElementById(`${a}`).textContent == 'X' || document.getElementById(`${a}`).textContent == 'O')) {
      if (turno == "X" && frame || turno == "O" && !frame) {
        for (var j = 1; j < 10; j++) {
          let w = panel + j;
          console.log(w);
          (document.getElementById(`${w}`)).style.backgroundColor = colorRosa;
          botonesOcupados.push(w);
        }
      } else if (turno == "O" && frame || turno == "X" && !frame) {
        for (var j = 1; j < 10; j++) {
          let w = panel + j;
          document.getElementById(`${w}`).style.backgroundColor = colorNaranja;
          botonesOcupados.push(w);
        }
      }
      panelesGanados.push(panel);
    }
    if (panelesGanados.includes(winCondition[i][0] * 10) && panelesGanados.includes(winCondition[i][1] * 10) && panelesGanados.includes(winCondition[i][2] * 10)) {


      if (window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][0]) + 1)}`)).backgroundColor === window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][1]) + 1)}`)).backgroundColor && window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][1]) + 1)}`)).backgroundColor == window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][2]) + 1)}`)).backgroundColor) {
        if (rgbToHex(window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][0]) + 1)}`)).backgroundColor) == colorRosa) {
          alert('Gano el jugador 1');
        }
        if (rgbToHex(window.getComputedStyle(document.getElementById(`${((10 * winCondition[i][0]) + 1)}`)).backgroundColor) == colorNaranja) {
          alert('Gano el jugador 2');
        }
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 5000);
        return true
      }
    }
  }
  return false;
}



function nextMove(panel) {
  console.log(`Entre a next move panel: ${panel}`);
  console.log(panelesGanados);
  panel = panel * 10;
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      var w = (i * 10) + j;
      if (panelesGanados.includes(panel)) {
        if (panelesGanados.includes(i * 10)) {
          botonesOcupados.push(w);
          if (rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorCyan) {
            document.getElementById(`${w}`).style.backgroundColor = colorWhite;
          }
        } else {
          if (rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorWhite || rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorCyan) {
            document.getElementById(`${w}`).style.backgroundColor = colorCyan;
            eliminarObjetoPorId(w);
          }
        }
      } else {
        if ((i * 10) == panel) {
          console.log('Entre aqui antes de leer colores');
          console.log(rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorWhite);
          console.log(rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorCyan);
          if (rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorWhite || rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorCyan) {
            document.getElementById(`${w}`).style.backgroundColor = colorCyan;
            console.log('Entre aqui a eliminar');
            eliminarObjetoPorId(w);
          }
        } else {
          if (rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorWhite || rgbToHex(window.getComputedStyle(document.getElementById(`${w}`)).backgroundColor) == colorCyan) {
            document.getElementById(`${w}`).style.backgroundColor = colorWhite;
            console.log('Entre aqui a agregar');
            botonesOcupados.push(w);
          }
        }
      }
    }
  }
}




function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function obtenerObjetoPorPanelBoton(id) {
  return botones.find(objeto => objeto.id === id);
}


function eliminarObjetoPorId(id) {
  var nuevaBotOcp = [];
  for(let i = 0; i<botonesOcupados.length;i++){
    if(botonesOcupados[i] != id){
      nuevaBotOcp.push(botonesOcupados[i]);
    }
  }
  botonesOcupados = nuevaBotOcp;
}

//Rutas de sockets

socket.on('refresh', () => {
  alert('Se desconecto el usuario, se reiniciara el tablero.');
  setTimeout(() => {
    location.reload();
  }, 5000);
});

socket.on('redirect', (destination) => {
  window.location.href = destination;
});

socket.on('obtener', (valor) => {
  if (wtf) {
    if (valor == 'X') {
      document.getElementById("turnin").innerHTML = (`1:"<section id="Turno"">X</section>"`);
      wtf = false;
    } else if (valor == 'O') {
      document.getElementById("turnin").innerHTML = (`2:"<section id="Turno"">O</section>"`)
    }
    turno = valor;
  }
});

socket.on('mensaje', (datos) => {
  var { panel, posicion } = datos;
  id = panel + posicion;
  var celda = document.getElementById(`${id}`);
  contenido = celda.textContent || celda.innerText;
  bailarLaMacarena(panel, posicion, false, contenido);
});