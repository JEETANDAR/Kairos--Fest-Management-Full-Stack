const Event = require('../schema/Event.schema');
const Score = require('../schema/Scores.schema');

/**
 * GET ALL EVENTS
 */
async function getEventsData() {
    try {
        const allEvents = await Event.find({})
            .lean()
            .select('-_id -__v');

        return allEvents;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

/**
 * ADD EVENTS
 * ⚠️  Only call this from a one-off seed script, NEVER from startUpPrograms.
 * This will throw if duplicates exist (by design) so you know if you're
 * accidentally calling it twice.
 */
async function addAllEvents(events) {
    try {
        console.log("🚀 Inserting events manually...");
        await Event.insertMany(events, { ordered: false });
        console.log("✅ Events inserted");
    } catch (error) {
        // Duplicate key errors are expected if some docs already exist
        if (error.code === 11000) {
            console.warn("⚠️  Some events already exist in DB — skipped duplicates.");
        } else {
            console.error("❌ Error inserting events:", error);
        }
    }
}

/**
 * GET EVENTS BY TYPE
 */
async function getEventsDataByID(eventType) {
    try {
        const event = await Event.find({
            eventType: eventType.toUpperCase()
        })
            .lean()
            .select({ _id: 0, __v: 0 });

        return event;
    } catch (error) {
        console.error("Error fetching event by type:", error);
        return [];
    }
}

/**
 * GET AMOUNT + MAX PARTICIPANTS
 */
async function getAmountAndMinimumNoOfParticipants(eventID) {
    try {
        const eventAMT = await Event.find({
            eventID: new RegExp(`^${eventID}$`, 'i')
        })
            .lean()
            .select({
                registrationFee: 1,
                maximumNoOfParticipants: 1
            });

        if (!eventAMT.length) {
            console.error(`❌ Event not found in DB for ID: ${eventID}`);
            return {
                amt: 0,
                maximumNoOfParticipants: 0
            };
        }

        return {
            amt: eventAMT[0].registrationFee,
            maximumNoOfParticipants: eventAMT[0].maximumNoOfParticipants
        };

    } catch (error) {
        console.error("Error fetching amount:", error);
        return {
            amt: 0,
            maximumNoOfParticipants: 0
        };
    }
}

/**
 * SYNC EVENTS WITH DATABASE 🔄
 * 
 * 1. Loads the seed data from the root events.data.js file
 * 2. Counts the documents currently in the Event collection
 * 3. If the count matches the seed data length → skip (already in sync)
 * 4. If the count differs → clear the collection and re-insert all events
 *
 * Call this once during server startup (e.g. inside startAllProcesses)
 */
async function syncEventsWithDB() {
    try {
        // ── 1. Load seed data from root ──────────────────────────────
        const seedEvents = require('../../events.data');

        if (!Array.isArray(seedEvents) || seedEvents.length === 0) {
            console.warn("⚠️  events.data.js is empty or not an array — skipping sync.");
            return;
        }

        // ── 2. Count existing documents in the Event collection ──────
        const dbCount = await Event.countDocuments();

        console.log(`📊 Events sync check → DB: ${dbCount} | Seed file: ${seedEvents.length}`);

        // ── 3. Compare counts ────────────────────────────────────────
        if (dbCount === seedEvents.length) {
            console.log("✅ Events collection is already in sync — no action needed.");
            return;
        }

        // ── 4. Out of sync → clear and re-seed ──────────────────────
        console.log("🔄 Events count mismatch — resyncing database...");

        await Event.deleteMany({});
        console.log("🗑️  Cleared existing events from the collection.");

        await Event.insertMany(seedEvents, { ordered: false });
        console.log(`✅ Successfully inserted ${seedEvents.length} events into the database.`);

    } catch (error) {
        console.error("❌ Error syncing events with DB:", error);
    }
}

module.exports = {
    getEventsData,
    getAmountAndMinimumNoOfParticipants,
    getEventsDataByID,
    addAllEvents,
    syncEventsWithDB,
};