const { addAllEvents } = require("../Data_Model/events.data");
const { addInHouseUsers } = require("../Data_Model/user/inHouseControler.data");
const { connectDB } = require("../utils/mongoDB");
const mongoose = require("mongoose");
require("dotenv").config();

let eventsIDs;

// Events Data
const events = [/* 👉 KEEP YOUR FULL EVENTS ARRAY SAME */];

eventsIDs = events.map((event) => event.eventID.toUpperCase());

// 🚀 MAIN FUNCTION
async function startAllProcesses() {
  console.log("Env: ", process.env.NODE_ENV);

  await connectDB();

  // ✅ SKIP ALL SEEDING — never auto-insert or re-insert data.
  // Whatever you delete or update in MongoDB Atlas will STAY deleted/updated.
  // If you ever need to seed data manually, do it via a one-off script, NOT here.

  console.log("🎉 DB connected. No auto-seeding. Your MongoDB data is safe.");
}

// ✅ EXPORT
module.exports = { startAllProcesses, eventsIDs };