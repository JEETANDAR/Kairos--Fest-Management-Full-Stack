const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserData = new Schema({
    userID: {
        type: Number,
        default: null,
    },
    userCount: {
        type: Number,
        default: null,
    },
    collegeName: {
        type: String,
        default: null,
    },
    emailID: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,  // Ensures no duplicates for email
    },
    name: {
        type: String,
    },
    phoneNo: {
        type: String,  // Phone numbers are usually stored as strings
        default: null,
    },
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'OrderNo',
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    userRole: {
        type: String,
        enum: ['user', 'admin', 'coordinator', 'facultyCoordinator'],
        default: 'user',
    },
    feedbackSubmitted: {
        type: Boolean,
        default: false,
    },
    certificateGenerated: {
        type: Boolean,
        default: false,
    },
    photoIDS: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    }
});

module.exports = mongoose.model('UserData', UserData);
