import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

const isTest = process.env.NODE_ENV === 'test'

const pool = new Pool({
  connectionString: isTest
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  options: '-c timezone=UTC',
})

const db = drizzle(pool, { schema })

export { db }
export default db
