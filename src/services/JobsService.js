const pool = require('../database/pool');
const { generateId } = require('../utils/idGenerator');
const { InvariantError, NotFoundError } = require('../utils/exceptions');

class JobsService {
  async addJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible = true,
    status = 'open'
  }) {
    const id = generateId('job');
    const query = {
      text: `INSERT INTO jobs(
        id, company_id, category_id, title, description, job_type, 
        experience_level, location_type, location_city, salary_min, 
        salary_max, is_salary_visible, status
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      values: [
        id, company_id, category_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min,
        salary_max, is_salary_visible, status
      ]
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lowongan kerja');
    }
    return result.rows[0].id;
  }

  async getAllJobs({ title, companyName }) {
    let query = `
      SELECT jobs.*, companies.name as company_name
      FROM jobs
      LEFT JOIN companies ON jobs.company_id = companies.id
      WHERE 1=1
    `;
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      query += ` AND jobs.title ILIKE $${values.length}`;
    }

    if (companyName) {
      values.push(`%${companyName}%`);
      query += ` AND companies.name ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `
        SELECT jobs.*, companies.name as company_name, categories.name as category_name
        FROM jobs
        LEFT JOIN companies ON jobs.company_id = companies.id
        LEFT JOIN categories ON jobs.category_id = categories.id
        WHERE jobs.id = $1
      `,
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateJobById(id, payload) {
    const existing = await this.getJobById(id);
    const merged = { ...existing, ...payload };

    const query = {
      text: `UPDATE jobs SET 
        company_id = $1, category_id = $2, title = $3, description = $4, job_type = $5,
        experience_level = $6, location_type = $7, location_city = $8, salary_min = $9,
        salary_max = $10, is_salary_visible = $11, status = $12, updated_at = CURRENT_TIMESTAMP
        WHERE id = $13 RETURNING id`,
      values: [
        merged.company_id, merged.category_id, merged.title, merged.description, merged.job_type,
        merged.experience_level, merged.location_type, merged.location_city, merged.salary_min,
        merged.salary_max, merged.is_salary_visible, merged.status, id
      ]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lowongan kerja. Id tidak ditemukan');
    }
  }

  async deleteJobById(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id]
    };
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus lowongan kerja. Id tidak ditemukan');
    }
  }

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `
        SELECT jobs.*, companies.name as company_name
        FROM jobs
        LEFT JOIN companies ON jobs.company_id = companies.id
        WHERE jobs.company_id = $1
      `,
      values: [companyId]
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: `
        SELECT jobs.*, companies.name as company_name
        FROM jobs
        LEFT JOIN companies ON jobs.company_id = companies.id
        WHERE jobs.category_id = $1
      `,
      values: [categoryId]
    };
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = JobsService;