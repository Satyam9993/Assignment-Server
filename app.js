const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ErrorMiddleware } = require('./middleware/error.js');
const userRouter = require('./routes/user.router.js');
const vendorRouter = require('./routes/vendor.router.js');
const notificationRouter = require('./routes/notification.router.js');
require('dotenv').config();

const app = express();

// body parser
app.use(express.json({limit:"50mb"}));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors());

// routes
app.use('/api/v1', userRouter);
app.use('/api/v1', vendorRouter);
app.use('/api/v1', notificationRouter);

// testing api
app.get("/", (req, res)=>{
    res.status(200).json({
        "success":true
    })
})

// unknown route
app.all("*", (req, res, next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statuscode=404;
    next(err);
})

// Error Handle Middleware
app.use(ErrorMiddleware);

module.exports = app;