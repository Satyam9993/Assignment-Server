const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    user :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    document: {
        type: String,
        default: null
    },
    dateOfShipping: {
        type: String,
        required: true
    },
    shippingSchedule1: {
        type: String,
        default: null
    },
    shippingSchedule2: {
        type: String,
        default: null
    },
    shippingSchedule3: {
        type: String,
        default: null
    },
    selectedSchedule: {
        type: String,
        default: null,
        enum: ['shippingSchedule1', 'shippingSchedule2', 'shippingSchedule3', null]
    },
    vendor : {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
