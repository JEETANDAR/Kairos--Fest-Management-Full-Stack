const { addAllEvents } = require("../Data_Model/events.data");
const { addInHouseUsers } = require("../Data_Model/user/inHouseControler.data");
const { connectDB } = require("../utils/mongoDB");
const mongoose = require("mongoose");
require("dotenv").config();

let eventsIDs;

// Events Data (KEEP YOUR SAME DATA HERE)
const events = [/* 👉 KEEP YOUR FULL EVENTS ARRAY SAME */];

eventsIDs = events.map((event) => event.eventID.toUpperCase());

// 🚀 MAIN FUNCTION
async function startAllProcesses() {
  console.log("Env: ", process.env.NODE_ENV);

  await connectDB();

  const coordinatorEmails = events.map((event) => ({
    name: event.studentCoordinator_1,
    emailID: event.studentCoordinator_Email_IDA,
    eventID: event.eventID.toUpperCase(),
  }));

  const users = [
    { emailID: "diagoarden@gmail.com", userRole: "admin" },
    ...coordinatorEmails,
  ];

  try {
    // ✅ CHECK EVENTS COLLECTION
    const eventCount = await mongoose.connection.db
      .collection("events")
      .countDocuments();

    if (eventCount === 0) {
      await addAllEvents(events, eventsIDs);
      console.log("✅ Events inserted");
    } else {
      console.log("⚡ Events already exist, skipping insert");
    }

    // ✅ CHECK USERS COLLECTION
    const userCount = await mongoose.connection.db
      .collection("users")
      .countDocuments();

    if (userCount === 0) {
      await addInHouseUsers(users);
      console.log("✅ Users inserted");
    } else {
      console.log("⚡ Users already exist, skipping insert");
    }

    console.log("🎉 All processes completed successfully.");
  } catch (error) {
    console.error("❌ Error in startAllProcesses:", error);
  }
}

// ✅ EXPORT (VERY IMPORTANT)
module.exports = { startAllProcesses, eventsIDs };  