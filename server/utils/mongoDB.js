const mongoose = require('mongoose');
require('dotenv').config();
const { MongoURI } = require('../utils/environmentalVariables');

// URL from .env
const URI = MongoURI;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    const mongooseConnection = mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        readPreference: "nearest",
        writeConcern: { w: "majority" },
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 300000,
    })
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => {
            console.error("MongoDB connection failed", err);
            process.exit(1); // Exit on failure
        });
}
module.exports = {connectDB};
