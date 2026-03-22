require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const dir   = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(dir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`  ▸ Running ${file}...`);
    await pool.query(sql);
  }

  console.log('✅ All migrations applied');
  await pool.end();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  console.error('💡 Make sure PostgreSQL is running and DB_URL in .env is correct');
  console.error('   Create DB first: psql -U postgres -c "CREATE DATABASE usejetlag;"');
  process.exit(1);
});
