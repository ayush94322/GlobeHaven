const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn} = require("../middleware.js");
const bookingController = require("../controller/booking.js");


router.get("/", isLoggedIn, wrapAsync(bookingController.bookingCustomization));
router.post("/create-order", isLoggedIn, wrapAsync(bookingController.createOrder));
router.get("/payment-success", bookingController.getSuccess);
router.post("/verify-payment", wrapAsync(bookingController.verifyPayment));

module.exports = router;
