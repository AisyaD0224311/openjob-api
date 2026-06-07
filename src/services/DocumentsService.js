const { Pool } = require('pg');
const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');

class DocumentsService {
  constructor() {
    this._pool = new Pool();
  }

  async uploadDocument(userId, file, originalFileName) {
    const query = `
      INSERT INTO documents (user_id, file_name, original_file_name, mime_type, file_size, file_path)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, file_name, original_file_name, mime_type, file_size, file_path, created_at
    `;

    const values = [
      userId,
      file.filename,
      originalFileName,
      file.mimetype,
      file.size,
      `/uploads/${file.filename}`,
    ];

    try {
      const result = await this._pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.message.includes('foreign key constraint')) {
        throw new ClientError('User tidak ditemukan', 404);
      }
      throw error;
    }
  }

  async getDocumentById(documentId) {
    const query = `
      SELECT id, user_id, file_name, original_file_name, mime_type, file_size, file_path, created_at, updated_at
      FROM documents
      WHERE id = $1
    `;

    const result = await this._pool.query(query, [documentId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    return result.rows[0];
  }

  async getDocumentsByUserId(userId) {
    const query = `
      SELECT id, user_id, file_name, original_file_name, mime_type, file_size, file_path, created_at, updated_at
      FROM documents
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this._pool.query(query, [userId]);
    return result.rows;
  }

  async deleteDocument(documentId, userId) {
    const query = `
      SELECT file_name FROM documents
      WHERE id = $1 AND user_id = $2
    `;

    const result = await this._pool.query(query, [documentId, userId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Dokumen tidak ditemukan atau Anda tidak memiliki akses untuk menghapus dokumen ini');
    }

    const deleteQuery = `
      DELETE FROM documents
      WHERE id = $1
      RETURNING id
    `;

    const deleteResult = await this._pool.query(deleteQuery, [documentId]);
    return deleteResult.rows[0];
  }

  async verifyDocumentOwnership(documentId, userId) {
    const query = `
      SELECT id FROM documents
      WHERE id = $1 AND user_id = $2
    `;

    const result = await this._pool.query(query, [documentId, userId]);
    return result.rows.length > 0;
  }
}

module.exports = DocumentsService;
