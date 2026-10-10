const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image, type } = req.body;
    const newFeature = new Feature({ image, type: type || "home-banner" });
    await newFeature.save();
    res.status(201).json({ success: true, data: newFeature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding feature image" });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const images = await Feature.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching feature images" });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feature.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting feature image" });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
