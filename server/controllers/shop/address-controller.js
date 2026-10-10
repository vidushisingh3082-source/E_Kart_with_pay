const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newAddress = new Address({ userId, address, city, pincode, phone, notes });
    await newAddress.save();
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });
    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching addresses" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updated = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error editing address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const deleted = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting address" });
  }
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
