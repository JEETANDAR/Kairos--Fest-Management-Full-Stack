const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { eventsIDs } = require('../../utils/startUpPrograms'); // Ensure this points to the correct file

const registrationFormat = new Schema({
    eventName: {
        type: String,
        enum: eventsIDs, // Assuming `events` is an array like ['Event1', 'Event2']
        required: true
    },
    orderID: {
        type: mongoose.Types.ObjectId,
        ref: "OrderNo",
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    teamDetails: {
        type: [String], // Corrected `string` to `String`
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: false,
    },
    arrived: {
        type: Boolean,
        required: true,
        default: false,
    },
    scoredMarks: {
        type: [Number],
        default: [],
        required: true,
    }
});

module.exports = mongoose.model('Teams', registrationFormat);
