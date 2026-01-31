const {  mongoose } = require('mongoose');
const Teams = require('../../schema/registrationSchema/registration.schema');

async function addRegistredTeams(data) {
    const addedData = await Teams.create(data);
    return addedData;
}

async function updatePaymentStatus(orderID) {
    console.log("Order Ids is: ", orderID);
    const convertedObjId = new mongoose.Types.ObjectId(orderID);
    const status = await Teams.updateMany({ orderID: convertedObjId }, { $set: { status: true } });
    return status;
}

async function eventRegistration(id) {
    return Teams.find({eventName: id});
}

module.exports = {
    addRegistredTeams,
    updatePaymentStatus,
    eventRegistration,
}