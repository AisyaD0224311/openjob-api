const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class ApplicationsService {
  async applyJob({ user_id, job_id, status = 'pending' }) {
    const id = generateId('application');
    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal mengirimkan lamaran pekerjaan');
    }
    return result.rows[0].id;
  }

  async getApplications() {
    const query = `
      SELECT apps.*, 
             users.name as user_name, users.email as user_email,
             jobs.title as job_title, companies.name as company_name
      FROM applications apps
      LEFT JOIN users ON apps.user_id = users.id
      LEFT JOIN jobs ON apps.job_id = jobs.id
      LEFT JOIN companies ON jobs.company_id = companies.id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: `
        SELECT apps.*, 
               users.name as user_name, users.email as user_email,
               jobs.title as job_title, companies.name as company_name
        FROM applications apps
        LEFT JOIN users ON apps.user_id = users.id
        LEFT JOIN jobs ON apps.job_id = jobs.id
        LEFT JOIN companies ON jobs.company_id = companies.id
        WHERE apps.id = $1
      `,
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lamaran pekerjaan tidak ditemukan');
    }
    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const query = {
      text: `
        SELECT apps.*, 
               jobs.title as job_title, companies.name as company_name
        FROM applications apps
        LEFT JOIN jobs ON apps.job_id = jobs.id
        LEFT JOIN companies ON jobs.company_id = companies.id
        WHERE apps.user_id = $1
      `,
      values: [userId]
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = {
      text: `
        SELECT apps.*, 
               users.name as user_name, users.email as user_email
        FROM applications apps
        LEFT JOIN users ON apps.user_id = users.id
        WHERE apps.job_id = $1
      `,
      values: [jobId]
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async updateApplicationStatus(id, status) {
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      values: [status, id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui status lamaran. Id tidak ditemukan');
    }
  }

  async deleteApplicationById(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus lamaran. Id tidak ditemukan');
    }
  }
}

module.exports = ApplicationsService;