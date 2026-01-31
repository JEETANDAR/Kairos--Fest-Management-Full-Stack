const { checkCoordinatorSessionInfo } = require('../../utils/userSessionRetrevial');
const { getEventRegistration } = require('../../Data_Model/registration/registration.data');

async function getCoordinatorInfo(req, res) {
    try {

        const info = await checkCoordinatorSessionInfo(req.session);
        console.log(info);

        return res.status(200).json({
            coordinatorName: info.name || '',
            coordinatorEmail: info.emailID,
            coordinatorEvent: info.eventID,
        });
    } catch (err) {
        console.log("Error to get Coordinator Info: ", err);
        return res.status(500).json("Internet Error");
    }
}

async function getEventParticipants(req, res) {
    try {
        const info = await checkCoordinatorSessionInfo(req.session);
        console.log(info);
        const data = await getEventRegistration(info.eventID)

        if (!data) {
            return res.status(400).json("No Event Found");
        }
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error to get participants Registration: ", err);
        return res.status(500).json("Erro to get participants info");
    }
}

module.exports = {
    getCoordinatorInfo,
    getEventParticipants,
}