const Review = require("../../models/Review");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// Has this logged-in user bought (and received) this product?
async function hasPurchased(userId, productId) {
  return Order.findOne({
    userId,
    "cartItems.productId": productId,
    paymentStatus: "paid", // COD becomes "paid" when admin marks Delivered
  });
}

const addReview = async (req, res) => {
  try {
    const { productId, userName, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id; // from the login cookie

    if (!(await hasPurchased(userId, productId))) {
      return res.status(403).json({
        success: false,
        message: "You can rate and review this product only after your order is delivered",
      });
    }

    // One review per customer per product: update it if it already exists
    let review = await Review.findOne({ productId, userId });
    const isUpdate = !!review;

    if (review) {
      review.reviewValue = reviewValue;
      review.reviewMessage = reviewMessage;
      review.userName = userName;
    } else {
      review = new Review({ productId, userId, userName, reviewMessage, reviewValue });
    }
    await review.save();

    const reviews = await Review.find({ productId });
    const average =
      reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, { averageReview: average });

    res.status(201).json({ success: true, updated: isUpdate, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding review" });
  }
};

const canReview = async (req, res) => {
  try {
    const ok = await hasPurchased(req.user.id, req.params.productId);
    res.json({ success: true, canReview: !!ok });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error checking review access" });
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

module.exports = { addReview, getReviews, canReview };
