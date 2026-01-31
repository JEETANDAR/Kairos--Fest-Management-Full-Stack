const { UserDetails, updateUserInfo } = require('../../../Data_Model/user.data');

async function updateUser(req, res) {
    try {
        const currentUser = req.session.passport.user.emailID; // Adjust if emailID is stored elsewhere
        const updatedData = req.body;
        console.log('uer detail: ',currentUser, updatedData)

        // Assuming updateUserInfo is defined elsewhere to handle database updates
        const data = await updateUserInfo(currentUser, updatedData);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// returns the user Data from the cookie
async function getUserDetails(req, res) {
    try {
        const cookieData = req.session.user.emailID;

        const data = await UserDetails(cookieData);

        if (!data) {
            return res.status(400).json('User Not Found');
        }

        return res.status(200).json(data);

    } catch (err) {
        console.error("Error", err);

        if (err instanceof TypeError) {
            res.status(400).json("Login to access the resource");
        }
        else {
            res.status(500).json({ message: err, path: 'get/updateUserInfo' });
        }
    }
}

module.exports = {
    updateUser,
    getUserDetails,
}