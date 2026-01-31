const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certs = new Schema({
    certificateID: {
        type: String,
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
    }
})


module.exports = mongoose.model("Cert", certs);