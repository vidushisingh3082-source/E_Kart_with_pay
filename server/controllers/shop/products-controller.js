const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sortBy } = req.query;
    let filters = {};

    if (category) filters.category = { $in: category.split(",") };
    if (brand) filters.brand = { $in: brand.split(",") };

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const products = await Product.find(filters).sort(sort);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
