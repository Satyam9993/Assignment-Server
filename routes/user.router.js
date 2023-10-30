const express = require("express");
const { registrationUser, activateUser, loginUser, logoutUser, getUserInfo, createVendors, selectSchedule } = require('../controllers/user.js');
const { isAuthentificated } = require("../middleware/auth.js");
const { createOrder, getAllOrders } = require("../controllers/orders.js");
const userRouter = express.Router();

userRouter.post('/register', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.post('/create-vendor', isAuthentificated, createVendors);

userRouter.post('/create-order', isAuthentificated, createOrder);

userRouter.put('/selectschedule/:id', isAuthentificated, selectSchedule);


userRouter.get('/getallorders', isAuthentificated, getAllOrders);

module.exports = userRouter;