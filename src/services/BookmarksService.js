const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class BookmarksService {
  async addBookmark({ user_id, job_id }) {
    // Check if job exists
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [job_id]);
    if (!jobCheck.rowCount) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan');
    }

    // Check if already bookmarked
    const checkQuery = {
      text: 'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      values: [user_id, job_id]
    };
    const checkResult = await pool.query(checkQuery);
    if (checkResult.rowCount > 0) {
      throw new InvariantError('Lowongan kerja sudah ditambahkan ke bookmark');
    }

    const id = generateId('bookmark');
    const insertQuery = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, user_id, job_id]
    };

    const result = await pool.query(insertQuery);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan bookmark');
    }
    return result.rows[0].id;
  }

  async deleteBookmark({ user_id, job_id }) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [user_id, job_id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Bookmark tidak ditemukan atau gagal dihapus');
    }
  }

  async getBookmarksByUserId(userId) {
    const query = {
      text: `
        SELECT b.id as bookmark_id, b.created_at as bookmarked_at, 
               j.id as id, j.title, j.job_type, j.experience_level, j.location_type, j.location_city,
               c.name as company_name, c.location as company_location
        FROM bookmarks b
        LEFT JOIN jobs j ON b.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE b.user_id = $1
      `,
      values: [userId]
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: 'SELECT id, user_id, job_id, created_at FROM bookmarks WHERE id = $1',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = BookmarksService;