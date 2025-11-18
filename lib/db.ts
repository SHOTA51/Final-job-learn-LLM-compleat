import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getPool() {
  if (pool) return pool
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('Please define DATABASE_URL environment variable')
  pool = mysql.createPool(databaseUrl)
  return pool
}

export async function query(sql: string, params: any[] = []) {
  const p = getPool()
  const [rows] = await p.query(sql, params)
  return rows
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
