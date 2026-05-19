const InventoryFacade = require('../services/InventoryFacade');

const getInventoryItems = async (_req, res) => {
  try {
    // Customer route: only active inventory items
    const items = await InventoryFacade.getActiveItems();
    res.json(items);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getAllInventoryItems = async (_req, res) => {
  try {
    // Admin route: all inventory items
    const items = await InventoryFacade.getAllItemsForAdmin();
    res.json(items);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const item = await InventoryFacade.createInventoryItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const item = await InventoryFacade.updateInventoryItem(
      req.params.id,
      req.body
    );

    res.json(item);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    await InventoryFacade.deleteInventoryItem(req.params.id);
    res.json({ message: 'Inventory item removed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getInventoryItems,
  getAllInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};