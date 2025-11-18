// Simple DB connection checker using mysql2/promise
// Usage: npm install mysql2 && node scripts/check-db-conn.js

const url = process.env.DATABASE_URL || require('fs').readFileSync('.env', 'utf8').split('\n').find(l=>l.startsWith('DATABASE_URL'))?.split('=')[1]

async function run() {
  try {
    if (!url) {
      console.error('DATABASE_URL not found in environment or .env')
      process.exit(1)
    }
    // remove surrounding quotes if present
    const databaseUrl = url.replace(/^"|"$/g, '')
    const mysql = require('mysql2/promise')
    console.log('[check-db-conn] Attempting to connect using:', databaseUrl)
    const pool = mysql.createPool(databaseUrl)
    const [rows] = await pool.query('SELECT 1 as ok')
    console.log('[check-db-conn] Success:', rows)
    await pool.end()
  } catch (err) {
    console.error('[check-db-conn] Error connecting to DB:')
    console.error(err && err.message ? err.message : err)
    process.exitCode = 1
  }
}

run()
