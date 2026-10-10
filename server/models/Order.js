const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        size: String,
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: { type: String, default: "Order Placed" }, // Order Placed | Packing | Shipped | Out for delivery | Delivered | Cancelled
    paymentMethod: { type: String, default: "cod" }, // cod | razorpay
    paymentStatus: { type: String, default: "pending" }, // pending | paid
    razorpayOrderId: String,
    razorpayPaymentId: String,
    totalAmount: Number,
    orderDate: { type: Date, default: Date.now },
    orderUpdateDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
