// jest.setup.js

// Increase timeout if DB operations take longer
jest.setTimeout(30000); 

// Load environment variables
require('dotenv').config();

// Db
require('./mongoDB');

// Clean up Mongoose connection after tests
// const mongoose = require('mongoose');
// afterAll(async () => {
  // await mongoose.connection.close();
// });
