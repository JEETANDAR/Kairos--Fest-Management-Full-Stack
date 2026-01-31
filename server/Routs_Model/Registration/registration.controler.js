const { getRegisteredEvents } = require('../../Data_Model/user.data');

const { checkUserSessionInfo } = require('../../utils/userSessionRetrevial');

async function getEventValue(req, res) {
    try {
        const userInfo = await checkUserSessionInfo(req.session);

        if (!userInfo) {
            return res.status(400).json("Invalid Session Login in again");
        }

        const registerdEvents = await getRegisteredEvents(userInfo.emailID);

        // if (!registerdEvents.includes(event)) {
        //     return res.status(400).json("No registration found");
        // }

        return res.status(200).json("Reacherd");
    } catch (err) {
        console.error("Erro in getting the events Data", err);
        return res.status(500).json("Error in getting the event Data");
    }
}


module.exports = {
    getEventValue,
}