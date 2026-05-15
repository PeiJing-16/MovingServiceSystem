const AppError = require('../errors/AppError');

class BaseCrudService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async getAll(sortOption = { createdAt: -1 }) {
    return this.model.find().sort(sortOption);
  }

  async getById(id) {
    const item = await this.model.findById(id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    return item;
  }

  async update(id, data) {
    const item = await this.getById(id);

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        item[key] = data[key];
      }
    });

    return item.save();
  }

  async delete(id) {
    const item = await this.getById(id);
    await item.deleteOne();
    return item;
  }
}

module.exports = BaseCrudService;