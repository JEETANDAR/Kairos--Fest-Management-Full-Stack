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

// get the accounts role
async function userRole(email) {
    return await UserData.findOne({ emailID: email }).lean().select({ _id: 0, userRole: 1 });
}

// used for registration in an event
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

/**
 * bulkUserCheckIn
 * 
 * NOW accepts either:
 *   - An array of email strings: ["a@b.com", "c@d.com"]
 *   - An array of participant objects: [{ email: "a@b.com", name: "Arjun", phone: "99..." }, ...]
 * 
 * If objects are passed, it will upsert name/phone/college into userdatas
 * so they appear correctly in the participants API later.
 */
async function bulkUserCheckIn(emailsOrParticipants) {
    try {
        // Detect if we received plain email strings or participant objects
        const isObjectArray =
            emailsOrParticipants.length > 0 &&
            typeof emailsOrParticipants[0] === 'object';

        if (isObjectArray) {
            // Upsert each participant — save name/phone/college if not already set
            const ops = emailsOrParticipants.map(p => {
                const email = (p.email || p.emailID || '').toLowerCase();
                return {
                    updateOne: {
                        filter: { emailID: email },
                        update: {
                            $setOnInsert: {
                                emailID: email,
                                name: p.name || '',
                                phoneNo: p.phone || p.phoneNo || '',
                                collegeName: p.college || p.collegeName || '',
                            },
                            // Only fill in name/phone/college if they're currently empty
                            $set: {},
                        },
                        upsert: true,
                    },
                };
            });

            // Run a smarter upsert: set name/phone/college only if the field is blank
            for (const p of emailsOrParticipants) {
                const email = (p.email || p.emailID || '').toLowerCase();
                if (!email) continue;

                const existing = await UserData.findOne({ emailID: email });
                if (!existing) {
                    // Brand new user — create with all details
                    await UserData.create({
                        emailID: email,
                        name: p.name || '',
                        phoneNo: p.phone || p.phoneNo || '',
                        collegeName: p.college || p.collegeName || '',
                    });
                } else {
                    // Existing user — only fill in missing fields
                    const updates = {};
                    if (!existing.name && p.name) updates.name = p.name;
                    if (!existing.phoneNo && (p.phone || p.phoneNo)) updates.phoneNo = p.phone || p.phoneNo;
                    if (!existing.collegeName && (p.college || p.collegeName)) updates.collegeName = p.college || p.collegeName;

                    if (Object.keys(updates).length > 0) {
                        await UserData.updateOne({ emailID: email }, { $set: updates });
                    }
                }
            }

            const emails = emailsOrParticipants.map(p => (p.email || p.emailID || '').toLowerCase());
            return await UserData.find({ emailID: { $in: emails } }).lean().select({ emailID: 1, _id: 0 });
        } else {
            // Plain email strings — original behaviour
            const emails = emailsOrParticipants.map(e => e.toLowerCase());
            return await UserData.find({ emailID: { $in: emails } }).lean().select({ emailID: 1, _id: 0 });
        }
    } catch (err) {
        console.error("Error in bulkUserCheckIn:", err);
        return [];
    }
}

// adds the order number to all the emails in one go
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

// function to get all the user registered events
async function getRegisteredEvents(email) {
    try {
        return await UserData.findOne({ emailID: email })
            .lean()
            .select({ _id: 0, __v: 0, events: 1 });
    } catch (err) {
        console.error("Error to get registered Events: ", err);
        return null;
    }
}

// checks if the user exists
async function userExists(email) {
    return UserData.findOne({ emailID: email });
}

async function getUserInfoWithEvents(email) {
    return UserData.findOne({ emailID: email });
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
    getUserInfoWithEvents,
};