
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http'); // Import the 'http' module
const socketIo = require('socket.io');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const Chat = require('./app/models/chat.js');
const Message = require('./app/models/Message.js');
const User = require('./app/models/User.js');
const mongoose = require('mongoose');
const path = require('path')
const upload = require("./app/middlewares/FolderImagesMulter.js")

app.use(cors({ origin: '*' }));
app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.static(path.join(__dirname, '..' , 'public')))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static("files"));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Social Media App!" });
});


// Create a single HTTP server
const server = http.createServer(app);

// Set up WebSocket server using socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204,
  },
});


app.get("/*",(req,res)=>{
  res.sendFile(__dirname,'public','index.html')
})

const socketAuth = require('./app/middlewares/socketAuth.js');

io.of('/api/socket').use(socketAuth).on("connect", (socket) => {
  console.log("User Connected: " + socket.id);

  // Handle a new message event
  socket.on('SendMessage', async (messageData) => {
    try {
      // Find the chat room based on the provided chat ID
      const chat = await Chat.findOne({ _id: messageData.chat_id });

      if (!chat) {
        // Handle the case where the chat room does not exist
        socket.emit('messageError', { error: 'Chat not found' });
        return;
      }

      if (messageData.images && messageData.images.length > 0) {
        // Handle multiple image uploads using Multer
        const uploadedImageUrls = [];

        upload.array('images')(socket.request, socket.request.res, async (err) => {
          if (err) {
            console.error(err);
            socket.emit('messageError', { error: 'Image upload failed' });
            return;
          }

          // Images were successfully uploaded, and the file details are available in request.files
          const uploadedImages = socket.request.files;

          for (const image of uploadedImages) {
            uploadedImageUrls.push(image.path);
          }

          // Create a new message with the array of image URLs
          const newMessage = new Message({
            chat: messageData.chat_id,
            sender: messageData.sender,
            text: messageData.text,
            images: uploadedImageUrls,
            status: messageData.status,
            createdAt: messageData.createdAt
          });

          // Save the message to the database
          await newMessage.save();

          // Broadcast the message to all connected clients in the same room
          socket.to(messageData.chat_id).emit('GetNewMessage', newMessage);
        });
      } else {
        // No images attached, create a message without images
        const newMessage = new Message({
          chat: messageData.chat_id,
          sender: messageData.sender,
          text: messageData.text,
          images: [],
          status: messageData.status,
          createdAt: messageData.createdAt
        });

        // Save the message to the database
        await newMessage.save();

        // Broadcast the message to all connected clients in the same room
        socket.to(messageData.chat_id).emit('GetNewMessage', newMessage);
      }
    } catch (error) {
      // Handle any errors that may occur during message processing
      console.error(error);
      socket.emit('messageError', { error: 'Message could not be sent' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log("User Disconnected");
  });
});

// Start the combined server for both HTTP and WebSocket
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Set up regular HTTP routes here
require("./app/routes/Ads.js")(app);
require("./app/routes/Alerts.js")(app);
require("./app/routes/category.js")(app);
require("./app/routes/admin.js")(app);
require("./app/routes/auth.js")(app);
require("./app/routes/Ads.js")(app);
require("./app/routes/Alerts.js")(app);
require("./app/routes/category.js")(app);
require("./app/routes/item.js")(app);
require("./app/routes/CommentItem.js")(app);
require("./app/routes/LikeItem.js")(app);
require("./app/routes/SaveItem.js")(app);
require("./app/routes/posts.js")(app);
require("./app/routes/CommentPost.js")(app);
require("./app/routes/LikePost.js")(app);
require("./app/routes/SavePost.js")(app);
require("./app/routes/Pole.js")(app);
require("./app/routes/vote_pole.js")(app);
require("./app/routes/Pole_options.js")(app);
require("./app/routes/friend_requests.js")(app);
require("./app/routes/ReportItem.js")(app);
require("./app/routes/ReportPost.js")(app);
require("./app/routes/Notifications.js")(app);

app.use("/chat", require("./app/routes/chat.js"));
app.use("/chat/message", require("./app/routes/messages.js"));
