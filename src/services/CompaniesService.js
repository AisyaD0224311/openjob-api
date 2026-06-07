const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class CompaniesService {
  async addCompany({ name, location, description }) {
    const id = generateId('company');
    const query = {
      text: 'INSERT INTO companies(id, name, location, description) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, location, description]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan perusahaan');
    }
    return result.rows[0].id;
  }

  async getCompanies() {
    const result = await pool.query('SELECT * FROM companies');
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateCompanyById(id, { name, location, description }) {
    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id',
      values: [name, location, description, id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui perusahaan. Id tidak ditemukan');
    }
  }

  async deleteCompanyById(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus perusahaan. Id tidak ditemukan');
    }
  }
}

module.exports = CompaniesService;