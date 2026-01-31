const inHouseRolesSchema = require('../../schema/Users/inHouseRoles.schema');


async function checkIfUserHasPerms(email) {
    return await inHouseRolesSchema.findOne({ emailID: email })
        .select({ _id: 0, userRole: 1 });
}

module.exports = { checkIfUserHasPerms };