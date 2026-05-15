const InventoryItem = require('../models/InventoryItem');
const BaseCrudService = require('./BaseCrudService');
const AppError = require('../errors/AppError');

class InventoryService extends BaseCrudService {
  constructor() {
    super(InventoryItem);
  }

  validateInventoryData(data) {
    if (!data.itemName || data.itemName.trim() === '') {
      throw new AppError('Item name is required', 400);
    }
  }

  async createInventoryItem(data) {
    this.validateInventoryData(data);

    const existingItem = await this.model.findOne({
      itemName: data.itemName.trim(),
      category: data.category || 'General',
    });

    if (existingItem) {
      throw new AppError('This inventory item already exists in this category', 400);
    }

    return this.create(data);
  }

  async getActiveItems() {
    return this.model.find({ isActive: true }).sort({
      category: 1,
      itemName: 1,
    });
  }

  async getAllItemsForAdmin() {
    return this.model.find().sort({
      category: 1,
      itemName: 1,
    });
  }

  async updateInventoryItem(id, data) {
    if (data.itemName !== undefined && data.itemName.trim() === '') {
      throw new AppError('Item name cannot be empty', 400);
    }

    return this.update(id, data);
  }
}

module.exports = InventoryService;