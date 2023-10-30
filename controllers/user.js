const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CatchAsync } = require("../middleware/catchAsyncError");
const { sendMail } = require('../utils/sendMail');
const { sendToken, accessTokenOptions, refreshTokenOptions } = require('../utils/jwt');
const { getUserById, getAllUsersService, updateUserRoleService } = require('../services/user');
const ErrorHandler = require('../utils/errorHandler');
const VendorModel = require('../models/vendor');
const Order = require('../models/purchase_order');
require("dotenv").config();

const Secret = process.env.ACTIVATION_SECRET;

// Register User
exports.registrationUser = CatchAsync(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("Email Already Exist", 400));
        }
        const user = {
            name,
            email,
            password
        }
        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;
        const data = {
            user: {
                name: user.name
            },
            activationCode
        }
        // const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"));
        try {
            await sendMail({
                email: user.email,
                subject: 'Activate your account',
                template: 'activation-mail.ejs',
                data
            });
            res.status(201).json({
                success: true,
                message: `Please check your email : ${user.email} to activate your account.`,
                activationToken: activationToken.token
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// activation code
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        user, activationCode
    }, Secret, {
        expiresIn: "5m"
    });
    return { token, activationCode };
}

// activate user
exports.activateUser = CatchAsync(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jwt.verify(
            activation_token,
            Secret
        )
        if (newUser.activationCode != activation_code) {
            return next(new ErrorHandler("Invalid activation code.", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = await User.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler("email already exist.", 400));
        }

        const user = await User.create({
            email,
            name,
            password
        });
        res.status(201).json({
            success: true
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// login user
exports.loginUser = CatchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        };

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email and password", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invlalid email and password", 400));
        }

        sendToken(user, 200, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

const generateRandomString=()=> {
    var length = 7;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// create vendors
exports.createVendors = CatchAsync(async (req, res, next) => {
    try {
        const password = generateRandomString();
        const {name, email} = req.body;
        const vendor = await VendorModel.create({
            name,
            email,
            password
        });
        try {
            const data = {
                name : vendor.name,
                email : vendor.email,
                password : password
            }
            await sendMail({
                email: vendor.email,
                subject: 'vendor account details',
                template: 'vendor-mail.ejs',
                data
            });
            res.status(201).json({
                success: true,
                message: `Email sent to ${vendor.email} with vendor account details.`,
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// select schedule
exports.selectSchedule = CatchAsync(async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { selectedSchedule } = req.body;
        let order = await Order.findOne({ _id : orderId, user: req.user._id });
        if (!order) {
            return next(new ErrorHandler("Invalid order", 400));
        }
        if(order.shippingSchedule1 === null || order.shippingSchedule2 === null || order.shippingSchedule3 === null){
            return next(new ErrorHandler("No Shipping dates and time available", 400));
        }
        if(order.selectedSchedule !== null){
            return next(new ErrorHandler("You can't select schedule again", 400));
        }
        order.selectedSchedule = selectedSchedule;
        order = await order.save();
        const notification = await Notification.create({
            to: order.vendor,
            from : req.user.id,
            title : "New Order",
            message : 'Order Shipping Scheduled on Order ID '+ orderId.slice(0, 5) + " by " + req.user.name,
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