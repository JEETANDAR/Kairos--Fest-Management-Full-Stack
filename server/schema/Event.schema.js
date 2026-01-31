const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventsDetails = new Schema({
    eventID: {
        type: String,
        require: true,
        uppercase: true,
    },
    eventType: {
        type: String,
        require: true,
        uppercase: true,
    },
    eventName: {
        type: String,
        require: true,
    },
    studentCoordinator_1: {
        type: String,
        require: true,
    },
    studentCoordinator_2: {
        type: String,
        require: true,
    },
    img: {
        type: String,
        required: true,
    },
    studentCoordinator_3: {
        type: String,
        require: true,
    },
    studentCoordinator_1PhoneNO: {
        type: String,
        require: true,
    },
    studentCoordinator_2PhoneNO: {
        type: String,
        require: true,
    },
    studentCoordinator_3PhoneNO: {
        type: String,
        require: true,
    },
    studentCoordinator_Email_IDA: {
        type: String,
        require: true,
    },
    facultyCoordinator_1: {
        type: String,
        require: true,
    },
    facultyCoordinator_2: {
        type: String,
        require: true,
    },
    facultyCoordinator_1PhoneNO: {
        type: String,
        require: true,
    },
    facultyCoordinator_2PhoneNO: {
        type: String,
        require: true,
    },
    descripton: {
        type: [String],
        require: true,
    },
    registrationFee: {
        type: Number,
        require: true,
    },
    time: {
        type: Date,
        require: true,
    },
    venue: {
        type: String,
        require: true,
    },
    minimumNoOfParticipants: {
        type: Number,
        require: true,
    },
    maximumNoOfParticipants: {
        type: Number,
        require: true,
    },
    winners: {
        type: Number,
        require: true,
    },
    runners:{
        type: Number,
        require: true,
    },
})

module.exports = mongoose.model('Event', eventsDetails);

