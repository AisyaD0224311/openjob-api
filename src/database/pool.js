const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || 5432, 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'admin123',
  database: process.env.PGDATABASE || 'openjob_api'
});

module.exports = pool;