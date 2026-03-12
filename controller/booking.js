const Listing = require("../models/listing");
const Razorpay = require("razorpay");
const Order = require("../models/order.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_CODE,
});

module.exports.bookingCustomization = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("bookings/booking.ejs", { listing });
};

module.exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    
    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });
    await newOrder.save();
    res.json(order); // Send order details to frontend, including order ID
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

module.exports.getSuccess = (req, res) => {
  res.send("Payment Successful!");
};

module.exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = process.env.RAZORPAY_SECRET_CODE;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret,
    );
    if (isValidSignature) {
      // Update the order with payment details
      const order = await Order.findOne({ orderId: razorpay_order_id });
      if (order) {
        order.status = "paid";
        order.paymentId = razorpay_payment_id;
        await Order.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            status: "paid",
            paymentId: razorpay_payment_id,
          },
        );
      }
      res.status(200).json({ status: "ok" });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: "verification_failed" });
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error verifying payment" });
  }
};
