const userModel = require("../models/user");
const VendorModel = require("../models/vendor");
const ErrorHandler = require("../utils/errorHandler");
const { CatchAsync } = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authenciate User
exports.isAuthentificated = CatchAsync(async (req, res, next) => {
    try {
        const access_token = req.header('Authorization');
        if(!access_token){
            return next(new ErrorHandler("Please login to access", 400));
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
        if(!decoded){
            return next(new ErrorHandler("Access Denied!", 400));
        }
        const user = await userModel.findById(decoded.id);  
        if(!user){
            return next(new ErrorHandler("please login in to access", 400));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

});

// Authenciate Vendor
exports.isAuthentificatedVendor = CatchAsync(async (req, res, next) => {
    try {
        const vendor_access_token = req.header('Authorization');;
        if(!vendor_access_token){
            return next(new ErrorHandler("Please login to access", 400));
        }

        const decoded = jwt.verify(vendor_access_token, process.env.ACCESS_TOKEN);
        if(!decoded){
            return next(new ErrorHandler("Access Denied!", 400));
        }
        const user = await VendorModel.findById(decoded.id);
        if(!user){
            return next(new ErrorHandler("please login in to access", 400));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

});
