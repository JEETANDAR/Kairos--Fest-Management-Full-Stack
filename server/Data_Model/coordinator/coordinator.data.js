const Coordinators = require('../../schema/Users/coordinator.schema');

async function getCoordinatorInfo(emailID) {
    return Coordinators.findOne({emailID: emailID});
}

module.exports = {
    getCoordinatorInfo,
}