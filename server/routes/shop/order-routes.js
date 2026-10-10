const express = require("express");
const {
  createOrder,
  verifyPayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");
const { authMiddleware } = require("../../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createOrder);
router.post("/verify", verifyPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
