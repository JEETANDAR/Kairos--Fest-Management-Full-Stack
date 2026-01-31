const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerifyOrders = Schema({
    razorpay_payment_id: {
        type: String,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        alias: 'razorpay_order_id'
    },
    razorpay_signature: {
        type: String,
    },
    status: {
        type: Boolean,
    }
});

module.exports = mongoose.model('VerifyOrders', VerifyOrders);