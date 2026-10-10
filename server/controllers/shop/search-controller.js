const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const regEx = new RegExp(keyword, "i");
    const products = await Product.find({
      $or: [{ title: regEx }, { description: regEx }, { category: regEx }, { brand: regEx }],
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error searching products" });
  }
};

module.exports = { searchProducts };
