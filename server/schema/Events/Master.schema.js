const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventDetails = Schema({
    eventName: {
        type: String,
    },
    orderNo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderNo'
    }
});

module.exports = mongoose.model('MasterTable', eventDetails);
