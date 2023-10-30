const Order = require('../models/purchase_order');
const Notification = require('../models/notification');
const ErrorHandler = require('../utils/errorHandler');
const { CatchAsync } = require('../middleware/catchAsyncError');

// create order by user
exports.createOrder = CatchAsync(async (req, res, next) => {
    try {
        const { productName, quantity, dateOfShipping, vendor, document } = req.body;
        const order = await Order.create({
            user: req.user.id,
            productName,
            quantity,
            dateOfShipping,
            vendor: vendor,
            document : document
        });
        const notification = await Notification.create({
            to: vendor,
            from : req.user.id,
            title : "New Order",
            message : 'New order has been placed by '+ req.user.name,
        });
        order.save();
        notification.save();
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update shipping schedule by vendor
exports.updateShippingSchedule = CatchAsync(async (req, res, next) => {

    const { shippingSchedule1, shippingSchedule2, shippingSchedule3 } = req.body;
    const order = await Order.findOne({ _id: req.params.id, vendor: req.user.id });

    if (!order) {
        return next(new ErrorHandler("Invalid order", 400));
    }

    if (order.shippingSchedule1 || order.shippingSchedule2 || order.shippingSchedule3) {
        return res.status(400).json({
            success: false,
            message: "You can't update shipping schedule again"
        });
    }
    Object.assign(order, { shippingSchedule1, shippingSchedule2, shippingSchedule3 });

    try {
        await order.save();
        const notification = await Notification.create({
            to: order.user,
            from : req.user.id,
            title : "New Order",
            message : 'Order is Scheduled by '+ req.user.name,
        });
        await notification.save();
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all orders by user
exports.getAllOrders = CatchAsync(async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
