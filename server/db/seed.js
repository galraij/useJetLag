require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

// A simple mock for queryInterface that handles bulkInsert for our pg pool
const queryInterface = {
  bulkInsert: async (tableName, records) => {
    for (const record of records) {
      const keys = Object.keys(record);
      const values = Object.values(record);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      await pool.query(query, values);
    }
    console.log(` ✅ Seeded ${records.length} records into ${tableName}`);
  },
  bulkDelete: async (tableName) => {
    await pool.query(`DELETE FROM ${tableName}`);
    console.log(` 🗑️ Cleared ${tableName}`);
  }
};

async function seed() {
  const dir = path.join(__dirname, 'seeders');
  if (!fs.existsSync(dir)) {
    console.log('No seeders directory found');
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();

  for (const file of files) {
    const seeder = require(path.join(dir, file));
    console.log(` ▸ Seeding ${file}...`);
    if (seeder.up) {
      await seeder.up(queryInterface, null);
    }
  }

  console.log('✅ All seeds applied');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
