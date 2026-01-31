const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 

orderNo

RazorPay

amount
attempts
created_at
currency
id
notes
offer_id
receipt
status

User

emailID
events
*/

const orderData = Schema({
    orderNo: {
        type: Number,
        ref: 'OrderNo',
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash"],
        required: true,
    },
    orderID: {
        type: String,
    },
    amount: {
        type: Number,
    },
    notes: {
        type: mongoose.Schema.Types.Mixed,
    },
    offer_id: {
        type: String,
    },
    receipt: {
        type: String,
    },
    emailID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
    },
    emails: {
        type: [{ type: String, lowercase: true }],
    },
    events: {
        type: Map,
        of: Schema.Types.Mixed, // Prevents auto-creation of subdocument _id fields
        default: {} // Ensures an empty object is stored if no events are provided
    },
    participantsNotEntered: {
        type: Map,
        of: Schema.Types.Mixed, // Prevents auto-creation of subdocument _id fields
        default: {} // Ensures an empty object is stored if no events are provided
    },
    allEntered: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
    }
});

module.exports = mongoose.model('OrdersSchema', orderData);