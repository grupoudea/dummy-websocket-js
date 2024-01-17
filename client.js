const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3001');

socket.on('open', () => {
  console.log('Conectado al servidor');

  // Manejar mensajes entrantes
  socket.on('message', (message) => {
    console.log(`Nuevo mensaje: ${message}`);
  });

  // Leer mensajes de la consola y enviarlos al servidor
  process.stdin.on('data', (data) => {
    const message = data.toString().trim();
    socket.send(message);
  });
});
