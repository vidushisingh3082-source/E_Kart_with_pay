const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
} = require("../../controllers/shop/cart-controller");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update", updateCartItemQty);
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;
