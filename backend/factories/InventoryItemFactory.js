class InventoryItemFactory {
    static createFromRequest(body) {
      return {
        itemName: body.itemName?.trim(),
        category: body.category?.trim() || 'General',
        isActive: body.isActive !== undefined ? body.isActive : true,
      };
    }
  
    static createUpdateObject(body) {
      const updateData = {};
  
      if (body.itemName !== undefined) {
        updateData.itemName = body.itemName.trim();
      }
  
      if (body.category !== undefined) {
        updateData.category = body.category.trim() || 'General';
      }
  
      if (body.isActive !== undefined) {
        updateData.isActive = body.isActive;
      }
  
      return updateData;
    }
  }
  
  module.exports = InventoryItemFactory;