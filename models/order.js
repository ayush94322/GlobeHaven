const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId : {
        type : String
    },
    amount : {
        type : Number
    },
    currency : {
        type : String
    },
    receipt : {
        type : String
    },
    status : {
        type : String
    },
    paymentId : {
        type : String
    }
});

module.exports = mongoose.model("Order", OrderSchema);