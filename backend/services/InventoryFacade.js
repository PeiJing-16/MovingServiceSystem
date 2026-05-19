const InventoryItemFactory = require('../factories/InventoryItemFactory');
const InventoryService = require('./InventoryService')

// Provides a simplified interface for inventory

class InventoryFacade {

    constructor() {
        this.inventoryService = new InventoryService();
    }

    async createIventoryItem(body) {
        const inventoryData = InventoryItemFactory.createFromRequest(body);
        return this.inventoryService.createInventoryItem(inventoryData);
    }

    // get active services for users
    async getActiveItems() {
        return this.inventoryService.getActiveItems();
    }

    // get all inventory items for admin
    async getAllItemsForAdmin() {
        return this.inventoryService.getAllItemsForAdmin();
    }

    // update inventory item
    async updateInventoryItem(id, body) {
        const updateData = InventoryItemFactory.createUpdateObject(body);
        return this.inventoryService.updateInventoryItem(id, updateData);
    }

    // delete 
    async deleteInventoryItem(id) {
        return this.inventoryService.delete(id);
    }
}

module.exports = new InventoryFacade();