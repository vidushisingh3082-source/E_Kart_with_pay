const Review = require("../../models/Review");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Only let users who've actually ordered the product leave a review
    const hasOrdered = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      paymentStatus: "paid",
    });
    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product before reviewing it",
      });
    }

    const alreadyReviewed = await Review.findOne({ productId, userId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You already reviewed this product" });
    }

    const newReview = new Review({ productId, userId, userName, reviewMessage, reviewValue });
    await newReview.save();

    const reviews = await Review.find({ productId });
    const average =
      reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, { averageReview: average });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding review" });
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

module.exports = { addReview, getReviews };
