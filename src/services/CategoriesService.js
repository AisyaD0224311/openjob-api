const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class CategoriesService {
  async addCategory({ name }) {
    const id = generateId('category');
    const query = {
      text: 'INSERT INTO categories(id, name) VALUES($1, $2) RETURNING id',
      values: [id, name]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan kategori');
    }
    return result.rows[0].id;
  }

  async getCategories() {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateCategoryById(id, { name }) {
    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      values: [name, id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan');
    }
  }

  async deleteCategoryById(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus kategori. Id tidak ditemukan');
    }
  }
}

module.exports = CategoriesService;