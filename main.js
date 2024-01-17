// server.js
const WebSocket = require('ws');
const fs = require('fs');

const server = new WebSocket.Server({ port: 3001 });

const clients = new Set();

// Función para obtener la próxima ID autoincremental
function getNextId(fileName) {
    try {
      const data = fs.readFileSync(fileName, 'utf8');
      const currentId = parseInt(data, 10) || 0;
      const nextId = currentId + 1;
  
      fs.writeFileSync(fileName, nextId.toString());
      
      return nextId;
    } catch (error) {
      console.error('Error al obtener la próxima ID:', error);
      return null;
    }
  }

server.on('connection', (socket) => {
    socket.send('Por favor, introduce tu nombre único de usuario:');
    let userId;

  // Manejar mensajes entrantes
  socket.on('message', (message) => {

    if (!userId && message.includes("/user")) {
        userId = message.trim();
  
        // Escribir el ID del usuario en el archivo 'users'
        fs.appendFileSync('users.txt', `${userId}\n`);
        
        socket.send(`¡Bienvenido al chat, ${userId}!`);
        return;
      }
  

    // Verificar si es un mensaje individual
    if (message.includes('/shopping')) {
        console.log("########################## msg: "+message);
        const [, targetUserId, ...msgContentArray] = String(message).split(' ');
        console.log("array");
        console.log(msgContentArray);

        const msgContent = msgContentArray.join(' ');
  
        const targetClient = Array.from(clients).find((client) => client.userId === targetUserId);
  
        if (targetClient) {
          targetClient.socket.send(`Mensaje privado de ${userId}: ${msgContent}`);
        } else {
          socket.send(`Usuario ${targetUserId} no encontrado.`);
        }
    } else {
      // Enviar el mensaje a todos los clientes conectados
      clients.forEach((client) => {
        client.socket.send(`Usuario ${userId}: ${message}`);
      });
    }
  });

  // Manejar cierre de conexión
  socket.on('close', () => {
    // Eliminar el socket de la lista de clientes cuando se cierra la conexión
    clients.delete({ socket, userId });
  });
});

console.log('Servidor WebSocket iniciado en el puerto 3000');
