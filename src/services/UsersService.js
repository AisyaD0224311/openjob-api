const pool = require('../database/pool');
const bcrypt = require('bcrypt');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError, AuthenticationError } = require('../utils/exceptions');

class UsersService {
  async addUser({ name, email, password, role = 'user' }) {
    await this.verifyNewEmail(email);

    const id = generateId('user');
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users(id, name, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, email, hashedPassword, role]
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User gagal didaftarkan');
    }

    return result.rows[0].id;
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email]
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Data email sudah terdaftar, gunakan email lain.');
    }
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, name, email, role FROM users WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredentials(email, password) {
    const query = {
      text: 'SELECT id, password, role FROM users WHERE email = $1',
      values: [email]
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword, role } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return { id, role };
  }
}

module.exports = UsersService;