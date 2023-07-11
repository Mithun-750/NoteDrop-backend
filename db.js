const mongoose = require('mongoose');
require('dotenv').config();


// MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    console.log(mongoURI)
    console.log("Initiating connection!");
    // Establish connection to MongoDB
    await mongoose.connect(mongoURI);
    console.log(`Connected to ${mongoURI}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
