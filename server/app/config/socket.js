const socketAuth = require('../middlewares/socketAuth.js');
const { createServer } = require('http');
const cors = require('cors');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use an appropriate port number

const server = createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204,

  },
});

const corsOptions = {
  origin: '*', 
};

app.use(cors(corsOptions));

app.set("io", io);

io.use((socket, next) => {
  // Add any necessary CORS configuration here, if needed
  next();
});

io.of('/api/socket').use(socketAuth).on("connection", (socket) => {
  console.log("User Connected: " + socket.id);
  socket.on('disconnect', () => {
    console.log("User Disconnected");
  });
});

// server.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

const sendMessage = (roomId, key, message) => io.of('/api/socket').to(roomId).emit(key, message);

module.exports = {
  io,
  createServer,
  sendMessage
};