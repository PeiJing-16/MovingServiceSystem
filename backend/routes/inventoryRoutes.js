const express = require('express');

const {
  getInventoryItems,
  getAllInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');

const router = express.Router();

// Customer route
router.get('/', getInventoryItems);

// Admin routes
router.get('/admin/all', getAllInventoryItems);
router.post('/', createInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

module.exports = router;