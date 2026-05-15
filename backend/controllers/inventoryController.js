const InventoryService = require('../services/InventoryService');
const InventoryItemFactory = require('../factories/InventoryItemFactory');

const inventoryService = new InventoryService();

const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message });
};

// Customer: only active inventory checklist items
const getInventoryItems = async (_req, res) => {
  try {
    const items = await inventoryService.getActiveItems();
    res.json(items);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: all inventory checklist items
const getAllInventoryItems = async (_req, res) => {
  try {
    const items = await inventoryService.getAllItemsForAdmin();
    res.json(items);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: create inventory item
const createInventoryItem = async (req, res) => {
  try {
    const itemData = InventoryItemFactory.createFromRequest(req.body);
    const item = await inventoryService.createInventoryItem(itemData);

    res.status(201).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: update inventory item
const updateInventoryItem = async (req, res) => {
  try {
    const updateData = InventoryItemFactory.createUpdateObject(req.body);

    const updatedItem = await inventoryService.updateInventoryItem(
      req.params.id,
      updateData
    );

    res.json(updatedItem);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    await inventoryService.delete(req.params.id);

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getInventoryItems,
  getAllInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};