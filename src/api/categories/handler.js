class CategoriesHandler {
  constructor(service) {
    this._service = service;

    this.postCategoryHandler = this.postCategoryHandler.bind(this);
    this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    this.getCategoryByIdHandler = this.getCategoryByIdHandler.bind(this);
    this.putCategoryByIdHandler = this.putCategoryByIdHandler.bind(this);
    this.deleteCategoryByIdHandler = this.deleteCategoryByIdHandler.bind(this);
  }

  async postCategoryHandler(req, res, next) {
    try {
      const { name } = req.body;
      const categoryId = await this._service.addCategory({ name });
      res.status(201).json({
        status: 'success',
        data: { id: categoryId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriesHandler(req, res, next) {
    try {
      const categories = await this._service.getCategories();
      res.json({
        status: 'success',
        data: { categories }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this._service.getCategoryById(id);
      res.json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async putCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await this._service.updateCategoryById(id, { name });
      res.json({
        status: 'success',
        message: 'Kategori berhasil diperbarui'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteCategoryById(id);
      res.json({
        status: 'success',
        message: 'Kategori berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesHandler;