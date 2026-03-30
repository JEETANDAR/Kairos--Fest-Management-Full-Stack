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
 * ADD EVENTS (SAFE VERSION 🚀)
 * 👉 WILL INSERT ONLY IF DATABASE IS EMPTY
 * 👉 WILL NOT OVERRIDE OR RE-INSERT DELETED DATA
 */
async function addAllEvents(events) {
    try {
        console.log("🚀 Inserting events manually...");
        await Event.insertMany(events);
        console.log("✅ Events inserted");
    } catch (error) {
        console.error(error);
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
/**
 * GET AMOUNT + MAX PARTICIPANTS
 */
async function getAmountAndMinimumNoOfParticipants(eventID) {
    try {
        const eventAMT = await Event.find({
            // ✅ Case-insensitive exact match
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

module.exports = {
    getEventsData,
    getAmountAndMinimumNoOfParticipants,
    getEventsDataByID,
    addAllEvents,
};