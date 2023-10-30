const express = require('express');
const notificationRouter = express.Router();
const { isAuthentificated, isAuthentificatedVendor } = require("../middleware/auth.js");
const { getNotifications, updateNotificationStatus } = require('../controllers/notification.js');

// admin notification routes

notificationRouter.get('/user/get-all-notification',isAuthentificated ,getNotifications);

notificationRouter.get('/vendor/get-all-notification',isAuthentificatedVendor ,getNotifications);

notificationRouter.put('/update-notification/:id' ,updateNotificationStatus);


// User notification routes

module.exports = notificationRouter;