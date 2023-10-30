const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    from : {
        type: Schema.Types.ObjectId,
        required: true
    },
    to : {
        type: Schema.Types.ObjectId,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true,
        default: 'unread'
    },
}, {timestamps: true});

const notificationModel = mongoose.model('Notification', notificationSchema);
module.exports = notificationModel;