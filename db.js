const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = "mongodb+srv://Mithun-750:Mithun%4012@cluster0.apv6krr.mongodb.net/NoteDrop?retryWrites=true&w=majority";

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    console.log("Initiating connection!");
    // Establish connection to MongoDB
    await mongoose.connect(mongoURI);
    console.log(`Connected to ${mongoURI}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
