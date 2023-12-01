const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const publicpath = path.join(__dirname, '/../public')
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = socketIO(server);

var clientes = 0;

app.use(express.static(publicpath));

io.on('connection', (socket) => {
  clientes++;
  if (clientes === 1) {
    io.emit('obtener', 'X');
  } else if (clientes === 2) {
    io.emit('obtener', 'O');
  } else {
    io.emit('adios', {
      mensaje: 'El servidor se ha llenado'
    });

    //Redirigir
    socket.emit('redirect', ('nodisponible.html'));
    clientes--;
    console.log('Usuario redireccionado');
    socket.disconnect(true); // Desconectar al nuevo cliente
    return;
  }
  console.log('Se ha conectado un usuario');
  console.log(`numero de clientes actuales ${clientes}`);

  socket.on('disconnect', () => {
    clientes--;
    console.log('Se ha desconectado un usuario ');
    console.log(`numero de clientes actuales ${clientes}`);
    io.emit('refresh', true);
  });

  socket.on('enviarDatos', (objeto) => {
    console.log(`Mensaje recibido: ${objeto}`);
    // Enviar el mensaje a todos los clientes excepto al que lo envió
    socket.broadcast.emit('mensaje', objeto);
  });

});

server.listen(PORT, () => {
  console.log(`Servidor abierto en puerto> ${PORT}...`)
});
