const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const SHIPPING_FEE = 10; // keep same as client/src/pages/shopping-view/checkout.jsx

// Created lazily so the server still starts (COD keeps working) even if the
// Razorpay keys are not set yet.
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Two payment methods:
//  - "cod": order is confirmed immediately, paid at delivery.
//  - "razorpay": order is saved as unpaid, paid in the Razorpay popup, and only
//    confirmed (stock reduced, cart cleared) after /verify checks the signature.

async function reduceStockAndClearCart(order) {
  for (const item of order.cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.totalStock = Math.max(0, product.totalStock - item.quantity);
      await product.save();
    }
  }
  await Cart.findOneAndDelete({ userId: order.userId });
}


function isValidSignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Flips pending -> paid exactly once, even if /verify and the webhook race.
async function markOrderPaid(orderId, paymentId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: "paid" } },
    { paymentStatus: "paid", razorpayPaymentId: paymentId },
    { new: true }
  );
  if (order) await reduceStockAndClearCart(order);
  return order;
}

// Razorpay -> our server. Safety net for when the customer closes the tab
// after paying and /verify never gets called.
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    // req.body is a raw Buffer here (see server.js)
    if (!isValidSignature(req.body, signature, secret)) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString("utf8"));
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        const order = await Order.findOne({ razorpayOrderId: payment.order_id });
        if (order) await markOrderPaid(order._id, payment.id);
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const createOrder = async (req, res) => {
  try {
    const { cartId, cartItems, addressInfo, totalAmount } = req.body;
    const userId = req.user.id; // from the login cookie, never from the request body

    if (!cartItems?.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const { paymentMethod = "cod" } = req.body;

    if (paymentMethod === "razorpay") {
      // Calculate the amount on the server from DB prices; never trust the
      // totalAmount sent by the browser.
      let subtotal = 0;
      for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({ success: false, message: "A product in your cart no longer exists" });
        }
        const unit = product.salePrice > 0 ? product.salePrice : product.price;
        subtotal += unit * item.quantity;
      }
      const serverTotal = subtotal + SHIPPING_FEE;

      const pendingOrder = await new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        totalAmount: serverTotal,
        paymentMethod: "razorpay",
        orderStatus: "Order Placed",
        paymentStatus: "pending",
        orderDate: new Date(),
      }).save();

      const rzpOrder = await getRazorpay().orders.create({
        amount: Math.round(serverTotal * 100), // paise
        currency: "INR",
        receipt: pendingOrder._id.toString(),
      });
      pendingOrder.razorpayOrderId = rzpOrder.id;
      await pendingOrder.save();

      return res.status(201).json({
        success: true,
        paymentMethod: "razorpay",
        orderId: pendingOrder._id,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount,
      paymentMethod: "cod",
      orderStatus: "Order Placed",
      paymentStatus: "pending",
      orderDate: new Date(),
    });

    await newOrder.save();

    // No payment gateway involved — confirm straight away, reduce stock
    // now, clear the cart, and send the customer to the success page.
    await reduceStockAndClearCart(newOrder);
    return res.status(201).json({
      success: true,
      paymentMethod: "cod",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    if (!isValidSignature(razorpay_order_id + "|" + razorpay_payment_id, razorpay_signature, process.env.RAZORPAY_KEY_SECRET)) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const order = await Order.findById(orderId);
    if (
      !order ||
      order.razorpayOrderId !== razorpay_order_id ||
      String(order.userId) !== String(req.user.id)
    ) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await markOrderPaid(order._id, razorpay_payment_id);
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    // Always the logged-in user's own orders; unpaid online attempts are hidden.
    const orders = await Order.find({
      userId: req.user.id,
      $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order || String(order.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  razorpayWebhook,
  getAllOrdersByUser,
  getOrderDetails,
};
