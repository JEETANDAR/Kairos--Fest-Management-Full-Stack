const UserData = require('../schema/Users/UserData.schema');

const { checkIfUserHasPerms } = require('./user/checkIfUserHasPerms');

// Search user by email ID
async function searchUser(email) {
    try {
        const findUser = await UserData.find({ emailID: email.emailID.toLowerCase() })
            .select({ _id: 0, __v: 0, userRole: 0, emailVerified: 0, userID: 0 });

        if (findUser.length === 0) return [];

        const user = findUser[0];

        // Ensure userID and emailVerified are set correctly
        if (!user.userID || !user.emailVerified) {
            await UserData.updateOne(
                { emailID: email.emailID.toLowerCase() },
                {
                    $set: {
                        userID: email.userID || email.emailID,
                        emailVerified: true,
                    },
                }
            );
        }

        return [user];
    } catch (err) {
        console.error("Error in searchUser:", err);
        return [];
    }
}

// Add new user to the database
async function addUser(userInfo) {
    try {
        // Check if user already exists
        let existingUser = await UserData.findOne({ emailID: userInfo.emailID })
            .select({ _id: 0, __v: 0, userRole: 0, emailVerified: 0, userID: 0 });

        if (existingUser) {
            console.log(`User with email ${userInfo.emailID} already exists.`, existingUser);
            return existingUser;
        }

        console.log("New user detected. Creating user entry...");
        const checkPrivilage = await checkIfUserHasPerms(userInfo.emailID);
        // Increment user count
        const counter = await UserData.findOneAndUpdate(
            { userCount: { $exists: true } },
            { $inc: { userCount: 1 } },
            { new: true, upsert: true }
        );

        console.log("User Privilage: ", checkPrivilage);

        let newUser;

        // Create new user with incremented userID
        if (checkPrivilage) {
            newUser = new UserData({
                ...userInfo,
                userID: counter.userCount,
                userRole: checkPrivilage.userRole,
            });
            await newUser.save();

        } else {
            newUser = new UserData({
                ...userInfo,
                userID: counter.userCount,
            });
            await newUser.save();

        }


        console.log("User added successfully:", newUser);

        return newUser;
    } catch (err) {
        console.error("Error in addUser:", err);
        throw err;
    }
}

// used to update user Information
async function updateUserInfo(currentUser, updatedInfo) {
    try {
        const find = await UserData.updateOne({ emailID: currentUser }, { $set: updatedInfo });
        console.log(find);
        return find;
    } catch (err) {
        console.error("Error in updateUserInfo:", err);
        throw err;
    }
}

// get the accoutns role
async function userRole(email) {
    return await UserData.findOne({ emailID: email }).lean().select({ _id: 0, userRole: 1 })
}

// useed for registration in an event
async function searchForRegisteredEvents(emailID) {
    try {
        return await UserData.findOne({ emailID }).lean().select({ events: 1, _id: 0 });
    } catch (err) {
        console.error("Error in searchForRegisteredEvents:", err);
        return null;
    }
}

// to add new participants
async function addParticipants(participants, key) {
    try {
        for (let participant of participants) {
            const email = participant.emailID.toLowerCase();

            const searchData = await UserData.findOne({ emailID: email });

            if (!searchData) {
                await UserData.create({
                    emailID: email,
                    name: participant.name,
                    phoneNo: participant.phoneNo,
                    events: [key],
                });
            } else {
                await UserData.updateOne(
                    { emailID: email },
                    { $addToSet: { events: key } }
                );
            }
        }
    } catch (err) {
        console.error("Error in addParticipants:", err);
        throw new Error('Error occurred while adding participants');
    }
}

// check if all the emails are there takes an array and return the found ones
async function bulkUserCheckIn(emails) {
    try {
        return await UserData.find({ emailID: { $in: emails } }).lean().select({ emailID: 1, _id: 0 });
    } catch (err) {
        console.error("Error in bulkUserCheckIn:", err);
        return [];
    }
}

// add dds the orders number to all the emails in one go
async function addOrderNoToUsersArray(orderNo, emails) {
    try {
        return await UserData.updateMany(
            { emailID: { $in: emails } },
            { $push: { events: orderNo } }
        );
    } catch (err) {
        console.error("Error in addOrderNoToUsersArray:", err);
        throw err;
    }
}

// used to give the user details
async function UserDetails(ID) {
    try {
        return await UserData.findOne({ emailID: ID })
            .lean()
            .select({ _id: 0, __v: 0, emailVerified: 0 });
    } catch (err) {
        console.error("Error in UserDetails:", err);
        return null;
    }
}

// functin to get all the user registered events
async function getRegisteredEvents(email) {
    try {
        return await UserData.findOne({ emailID: email })
            .lean()
            .select({ _id: 0, __v: 0, events: 1 })
    } catch (err) {
        console.error("Error to get registed Events: ", err);
        return null;
    }
}

// checks if the user exist
async function userExists(email) {
    return UserData.findOne({ emailID: email });
}

async function getUserInfoWithEvents(email) {
    return UserData.findOne({emailID: email})
}

module.exports = {
    searchUser,
    addUser,
    updateUserInfo,
    userRole,
    searchForRegisteredEvents,
    addParticipants,
    bulkUserCheckIn,
    addOrderNoToUsersArray,
    UserDetails,
    getRegisteredEvents,
    userExists,
};
