import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '../../generated/prisma'

export type { Prisma }
export { PrismaClient }

type DbClient = PrismaClient

const createPrismaClient = (): DbClient => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  // Prevent idle connection drops from throwing unhandled EventEmitter errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client (auto-handled):', err)
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: DbClient | undefined
}

export const db: DbClient = globalForPrisma.prisma ?? createPrismaClient()

globalForPrisma.prisma = db

