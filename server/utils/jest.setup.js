// jest.setup.js

// Increase timeout if DB operations take longer
jest.setTimeout(30000);

// Load environment variables
require('dotenv').config();

// ✅ Explicitly connect DB before tests run (not on import side-effect)
const { connectDB } = require('./mongoDB');

beforeAll(async () => {
    await connectDB();
});

// ✅ Close Mongoose connection after all tests finish
const mongoose = require('mongoose');
afterAll(async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed after tests.");
});