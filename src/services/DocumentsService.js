const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class DocumentsService {
  async addDocument({ user_id, name, filename, filepath }) {
    const id = generateId('document');
    const query = {
      text: 'INSERT INTO documents(id, user_id, name, filename, filepath) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, user_id, name, filename, filepath]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan dokumen');
    }
    return result.rows[0].id;
  }

  async getDocumentsByUserId(userId) {
    const query = {
      text: 'SELECT id, name, filename, filepath, created_at FROM documents WHERE user_id = $1',
      values: [userId]
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT id, user_id, name, filename, filepath, created_at FROM documents WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = DocumentsService;