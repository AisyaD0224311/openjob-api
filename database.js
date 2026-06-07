const { Client } = require('pg');
require('dotenv').config();

const pgUser = process.env.PGUSER || 'postgres';
const pgPassword = process.env.PGPASSWORD || 'admin123';
const pgHost = process.env.PGHOST || 'localhost';
const pgPort = process.env.PGPORT || 5432;
const pgDatabase = process.env.PGDATABASE || 'openjob_api';

async function main() {
  const client = new Client({
    user: pgUser,
    password: pgPassword,
    host: pgHost,
    port: parseInt(pgPort, 10),
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to default postgres database successfully!');

    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [pgDatabase]);
    if (res.rowCount === 0) {
      console.log(`Database '${pgDatabase}' does not exist. Creating it...`);
      await client.query(`CREATE DATABASE "${pgDatabase}"`);
      console.log(`Database '${pgDatabase}' created successfully!`);
    } else {
      console.log(`Database '${pgDatabase}' already exists.`);
    }
  } catch (err) {
    console.error('Error connecting/creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }

  const targetClient = new Client({
    user: pgUser,
    password: pgPassword,
    host: pgHost,
    port: parseInt(pgPort, 10),
    database: pgDatabase
  });

  try {
    await targetClient.connect();
    console.log(`Verified connection to target database '${pgDatabase}' successfully!`);
  } catch (err) {
    console.error(`Failed to connect to target database '${pgDatabase}':`, err);
    process.exit(1);
  } finally {
    await targetClient.end();
  }
}

main();
