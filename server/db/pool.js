const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DB_URL, ssl: { rejectUnauthorized: false } });
module.exports = pool;
