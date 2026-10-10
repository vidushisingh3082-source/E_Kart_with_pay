const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ["home-banner", "about-us", "contact-us"],
      default: "home-banner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
