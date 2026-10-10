const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: { type: String, required: true },
    description: String,
    category: String,
    brand: String,
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    sizes: { type: [String], default: ["xs", "s", "m", "l", "xl"] },
    averageReview: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
