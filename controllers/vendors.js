const VendorModel = require("../models/vendor");
const ErrorHandler = require("../utils/errorHandler");
const {CatchAsync} = require("../middleware/catchAsyncError");
const { sendTokenVendor } = require("../utils/jwt");
const Order = require("../models/purchase_order");


// login vendor
exports.loginVendor = CatchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        };

        const vendor = await VendorModel.findOne({ email }).select("+password");

        if (!vendor) {
            return next(new ErrorHandler("Invalid email and password", 400));
        }

        const isPasswordMatch = await vendor.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invlalid email and password", 400));
        }

        sendTokenVendor(vendor, 200, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// get all vendors
exports.getAllVendors = CatchAsync(async (req, res, next) => {
    try {
        
        const vendors = await VendorModel.find().select("email name");

        res.status(200).json({
            success: true,
            vendors
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get orders by vendor
exports.getOrdersByVendor = CatchAsync(async (req, res, next) => {
    try {
        const orders = await Order.find({ vendor: req.user._id, selectedSchedule : null });
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}); 