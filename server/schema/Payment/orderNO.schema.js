const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNo: {
        type: Number,
        unique: true,
        required: true, // Ensures orderNo is always provided
    },
    emailID: {
        type: String,
        lowercase: true, // Converts email to lowercase for consistency
        trim: true,
    },
    emails: {
        type: [{ type: String, lowercase: true }],
    },
    events: {
        type: Map,
        of:Schema.Types.Mixed, // Prevents auto-creation of subdocument _id fields
        default: {} // Ensures an empty object is stored if no events are provided
    },
    participantsNotEntered: {
        type: Map,
        of:Schema.Types.Mixed, // Prevents auto-creation of subdocument _id fields
        default: {} // Ensures an empty object is stored if no events are provided
    },
    allEntered: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash"],
        required: true,
    },
});

module.exports = mongoose.model('OrderNo', orderSchema);
