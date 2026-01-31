const eventsData = require('../../../Data_Model/events.data');
const routsDocument = require('../../../routsDetails');

// Gives the project Description
async function getProjectDetails(req, res) {
    // return res.status(200).json("Hi, this is our project.");
    return res.status(200).json(routsDocument);
}

// Gives the Events Details
async function getEvents(req, res) {
    try {
        const events = await eventsData.getEventsData();
        return res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        return res.status(500).json({ error: "Failed to fetch events." });
    }
}

async function getEventsInfoByID(req, res) {
    try {
        const url = req.url;
        const eventType = url.split('/')[2];
        console.log("The event type is: ", eventType.toUpperCase());
        const eventData = await eventsData.getEventsDataByID(eventType);
        console.log(eventType, eventData)
        return res.status(200).json(eventData);
    } catch(err) {
        console.log("Error in getting the data with its id: ", err);
        return res.status(500).json({error: "Failed to fetch error with ID"});
    }
}

module.exports = {
    getProjectDetails,
    getEvents,
    getEventsInfoByID,
};
