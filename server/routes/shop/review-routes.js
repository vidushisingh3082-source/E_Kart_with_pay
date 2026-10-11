const express = require("express");
const { addReview, getReviews, canReview } = require("../../controllers/shop/review-controller");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.post("/add", authMiddleware, addReview);
router.get("/can-review/:productId", authMiddleware, canReview);
router.get("/:productId", getReviews);

module.exports = router;
