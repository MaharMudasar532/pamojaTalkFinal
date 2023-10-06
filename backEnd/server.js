const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http'); // Import the 'http' module
const socketIo = require('socket.io');
const app = express();
const { sql } = require('./app/config/db.config');
require('dotenv').config();
const path = require("path");

var corsOptions = {
  // origin: "http://localhost:8081"
};

app.use(cors());
app.use(express.static(path.join(__dirname,'.','public')))
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static("files"));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Social Media App!" });
});

require("./app/routes/admin")(app);
require("./app/routes/auth")(app);
require("./app/routes/Ads")(app);
require("./app/routes/Alerts")(app);
require("./app/routes/category")(app);
require("./app/routes/item")(app);
require("./app/routes/CommentItem")(app);
require("./app/routes/LikeItem")(app);
require("./app/routes/SaveItem")(app);
require("./app/routes/posts")(app);

require("./app/routes/Pole")(app);
require("./app/routes/vote_pole")(app);
require("./app/routes/Pole_options")(app);

//not converted yet
// require("./app/routes/friend_requests")(app);
// require("./app/routes/chat")(app);
// app.use("/chat", require("./app/routes/chat"));
// app.use("/chat/message", require("./app/routes/messages"));

const {createServer} = require('./app/config/socket');


// set port, listen for requests
const PORT = process.env.PORT || 3002;
createServer(app, PORT)
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });



// const express = require('express');
// // Import the MongoDB connection from config.js
// const config = require('./app/config/config');
// const app = express();
// const cors = require('cors')
// const bodyParser = require("body-parser"); 
// require('dotenv').config();
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json());
// app.use(express.static("files"));
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"))
// app.use(cors({
//     methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
// }));

// const port = process.env.PORT || 3010;

// // Middleware
// app.use(express.json());
// // MongoDB connection error handling
// config.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

// // MongoDB connection successful message
// config.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Define routes
// const invoiceRoutes = require('./app/routes/invoiceRoute');
// const paymentRoute = require('./app/routes/paymentRoute');

// // Use the routes
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/payments', paymentRoute);

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
