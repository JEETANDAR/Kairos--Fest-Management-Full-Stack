const { mongoose } = require('mongoose');
const Schema = require('mongoose').Schema;


const scoreData = new Schema({
    eventID: {
        type: String,
        require: true,
    },
    eventName: {
        type: String,
        require: true,
    },
    studentCoordinator: {
        default: 0,
        type: Boolean,
    },
    teacherCoordinator: {
        default: 0,
        type: Boolean,
    },
    firstPlace: {
        default: null,
        type: String,
    },
    firstPlacePoints: {
        default: null,
        type: [Number],
    },
    firstPlaceTotalPoints: {
        default: null,
        type: Number,
    },
    secondPlace: {
        default: null,
        type: String,
    },
    secondPlacePoints: {
        default: null,
        type: [Number],
    },
    secondPlaceTotalPoints: {
        default: null,
        type: Number,
    }
})



module.exports = mongoose.model('Score', scoreData);