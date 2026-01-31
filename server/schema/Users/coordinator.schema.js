const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { eventsIDs } = require('../../utils/startUpPrograms'); // Ensure this is a valid array

const CoordinatorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
    },
    eventID: {
        type: String,
        enum: Array.isArray(eventsIDs) && eventsIDs.length > 0 ? eventsIDs : ["DefaultEvent"],
        required: true,
    },
    roundsConducted: {
        type: Number,
        required: true,
        default: 0,
    }
});

// Prevents re-compiling the model if already defined
const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);
module.exports = Coordinator;