const mongoose = require('mongoose');
require('dotenv').config();

// Define your MongoDB connection URI
// const mongoURI = process.env.mongoURI;
const mongoURI = "mongodb://localhost:27017/pamojaTalk"
// const mongoURI = "mongodb+srv://pamojaTalk:pamojaTalk@cluster0.01fkdqi.mongodb.net/pamojaTalk"


// MongoDB connection options (optional)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
};

// Connect to MongoDB
mongoose
  .connect(mongoURI, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose.connection;
