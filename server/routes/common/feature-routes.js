const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
const { authMiddleware, isAdmin } = require("../../middleware/auth");

const router = express.Router();

router.post("/add", authMiddleware, isAdmin, addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/:id", authMiddleware, isAdmin, deleteFeatureImage);

module.exports = router;
