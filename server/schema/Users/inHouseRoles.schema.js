const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const inHouseRoles = new Schema({
    emailID: {
        type: String,
        require: true,
    },
    userRole: {
        type: String,
        enum: ['user', 'admin', 'coordinator', 'facultyCoordinator'],
        default: 'user',
    },
})

const InHouseRoles = mongoose.model("InHouseRoles", inHouseRoles);
module.exports = InHouseRoles;