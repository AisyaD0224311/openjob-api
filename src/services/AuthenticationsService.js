const pool = require('../database/pool');
const { InvariantError } = require('../utils/exceptions');

class AuthenticationsService {
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token]
    };
    await pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid atau tidak terdaftar.');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token gagal dihapus. Token tidak ditemukan.');
    }
  }
}

module.exports = AuthenticationsService;