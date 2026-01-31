const { userExists } = require('../Data_Model/user.data');
const {getCoordinatorInfo} = require('../Data_Model/coordinator/coordinator.data');
require('dotenv').config()

async function checkUserSessionInfo(session) {
    try {
        let user;
        if (process.env.NODE_ENV != 'production') {
            user = session.passport.user.emailID || 'diagoarden@gmail.com'
        } else {
            user = session.passport.user.emailID
        }

        const isUser = await userExists(user);

        if (isUser) {
            return isUser;
        } else {
            return null;
        }

    } catch (err) {
        console.log("Error in verifying the session: ", err);
        throw new Error("Session Not found");
    }
}

async function checkCoordinatorSessionInfo(session) {
    try {
        let user;
        if (process.env.NODE_ENV != 'production') {
            user = session.passport.user.emailID || 'diagoarden@gmail.com'
        } else {
            user = session.passport.user.emailID
        }

        const isUser = await getCoordinatorInfo(user);

        if (isUser) {
            return isUser;
        } else {
            return null;
        }

    } catch (err) {
        console.log("Error in verifying the session: ", err);
        throw new Error("Session Not found");
    }
}

module.exports = {
    checkUserSessionInfo,
    checkCoordinatorSessionInfo,
}