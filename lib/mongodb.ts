// MongoDB helper removed. Project migrated to MariaDB/MySQL.
// This module intentionally throws if used so any remaining MongoDB
// calls surface quickly. Use `lib/db.ts` and the `query()` helper instead.

export async function getDatabase() {
  throw new Error('MongoDB removed: use DATABASE_URL and lib/db (mysql). Update imports to use `query` from `@/lib/db`.')
}

export async function connectToDatabase() {
  return getDatabase()
}

export async function closeDatabase() {
  return
}
