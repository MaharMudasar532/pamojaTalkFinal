const cors = require('cors');
const socketAuth = require('../middlewares/socketAuth.js');

let io;

const createServer = (app, port) => {
  const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
  // initialize server with web socket
  const server = require("http").createServer(app);
  io = require('socket.io')(server, {
    cors: { origin: '*' }
  });
  app.set("io", io);

  io.use(cors());

  // Socket.io
  io.of('/api/socket').use(socketAuth).on("connection", (socket) => {
    console.log("User Connected: " + socket.id);
    socket.on('disconnect', () => {
      console.log("User Disconnected");
    })
  });

  // start express app
  server.listen(port, console.log(`Listening on ${HOSTNAME}:${port}`))
}

const sendMessage = (roomId, key, message) => io.of('/api/socket').to(roomId).emit(key, message);

module.exports = {
  io,
  createServer,
  sendMessage
}





















// const socketIo = require('socket.io');
// const http = require('http');
// const server = http.createServer();

// const io = socketIo(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('join', (userId) => {
//     socket.join(userId);
//   });

//   socket.on('chat', (message) => {
//     // Handle chat messages here and broadcast to users as needed
//     io.to(message.receiverId).emit('message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// module.exports = {
//   io,
//   server,
// };
