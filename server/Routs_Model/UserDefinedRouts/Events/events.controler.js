// Data File
const { getEventRegistration } = require('../../../Data_Model/registration/registration.data');
const { checkUserSessionInfo } = require('../../../utils/userSessionRetrevial');


async function registeredEvents(req, res) {
    try {
        const userData = await checkUserSessionInfo(req.session);
        console.log("EmailID is this: ", userData.events);
        const findRegistredEvents = userData.events;

        if (findRegistredEvents.length > 0) {
            const eventsInfo = await getEventRegistration(findRegistredEvents);
            console.log("Event Info is : ", eventsInfo);
            return res.status(200).json(eventsInfo);
        } else {
            return res.status(200).json('registration for a event');
        }

    } catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: "Internet error", err: err })
    }
}

module.exports = {
    registeredEvents,
}