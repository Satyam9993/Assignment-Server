const Notification = require('../models/notification');
const { CatchAsync } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const cron = require('node-cron');


// get all notifications -- only admin
exports.getNotifications = CatchAsync(async (req, res, next) => {
    try {
        const notifications = await Notification.find({to : req.user._id, status: "unread"}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update notification status -- only admin
exports.updateNotificationStatus = CatchAsync(async (req, res, next) => {
    try {
        console.log("YEs");
        const notification = await Notification.findById(req.params.id);
        if(!notification){
            return next(new ErrorHandler('Notification not found', 404));
        }
        if(notification.status){
            notification.status = "read";
        }

        // // save notification
        await notification.save();

        const notifications = await Notification.find({to : notification.to, status: "unread"}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});    

// Automation task
// delete notification -- only admin
cron.schedule('0 0 0 * * *', async () => {
    try {
        const thirdtyDaysAgo = new Date(new Date() - 30*24*60*60*1000);
        await Notification.deleteMany({status: "read", createdAt: {$lte: thirdtyDaysAgo}});
        console.log('Notification read deleted');
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});