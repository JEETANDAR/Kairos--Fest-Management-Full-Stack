const { syncEventsWithDB } = require("../Data_Model/events.data");
const { connectDB } = require("../utils/mongoDB");
const mongoose = require("mongoose");
require("dotenv").config();

// Events data loaded from root seed file
const events = require('../../events.data');

const eventsIDs = Array.isArray(events)
    ? events.map((event) => event.eventID.toUpperCase())
    : [];

// 🚀 MAIN FUNCTION
async function startAllProcesses() {
  console.log("Env: ", process.env.NODE_ENV);

  await connectDB();

  // ✅ Sync events: compares seed file count vs DB count, re-seeds if different
  await syncEventsWithDB();

  console.log("🎉 DB connected. Events synced.");
}

// ✅ EXPORT
module.exports = { startAllProcesses, eventsIDs };