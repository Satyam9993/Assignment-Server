const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");

// get user by Id
exports.getUserById = async (id, res, next) => {
    try {
        const user = JSON.parse(userJson);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

// get all users -- only admin
exports.getAllUsersService = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};


// update user -- only admin
exports.updateUserRoleService = async (userId, role, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};