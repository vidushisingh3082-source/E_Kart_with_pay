const express = require("express");
const { addReview, getReviews } = require("../../controllers/shop/review-controller");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.post("/add", authMiddleware, addReview);
router.get("/:productId", getReviews);

module.exports = router;
