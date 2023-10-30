const express = require("express");
const { loginVendor, getAllVendors, getOrdersByVendor } = require('../controllers/vendors.js');
const { isAuthentificatedVendor, isAuthentificated } = require("../middleware/auth.js");
const { updateShippingSchedule } = require("../controllers/orders.js");
const vendorRouter = express.Router();

vendorRouter.post('/vendor/login', loginVendor);

vendorRouter.get('/vendor/all', isAuthentificated, getAllVendors);

vendorRouter.put('/update-order/:id', isAuthentificatedVendor, updateShippingSchedule);

vendorRouter.get('/vendor/orders/all', isAuthentificatedVendor, getOrdersByVendor);

module.exports = vendorRouter;