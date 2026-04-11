const mongoose = require('mongoose');
require('dotenv').config();
const { MongoURI } = require('../utils/environmentalVariables');

const URI = MongoURI;

// ✅ Track connection state — never reconnect if already connected
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("⚡ MongoDB already connected, reusing connection.");
        return;
    }

    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            readPreference: "nearest",
            writeConcern: { w: "majority" },
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 300000,
        });

        isConnected = true;
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};

module.exports = { connectDB };