import * as dotenv from 'dotenv'
import * as path from 'path'
import { Client } from 'pg'
import * as readline from 'readline'

function buildConnectionString(prefix: string): string {
  const host = process.env[`${prefix}_HOST`]
  const database = process.env[`${prefix}_DATABASE`]
  const user = process.env[`${prefix}_USER`]
  const password = process.env[`${prefix}_PASSWORD`]
  const sslmode = process.env[`${prefix}_SSLMODE`] || 'require'

  if (!host || !database || !user || !password) {
    throw new Error(`Missing required ${prefix}_* environment variables`)
  }

  return `postgresql://${user}:${password}@${host}/${database}?sslmode=${sslmode}`
}

async function promptConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes')
    })
  })
}

async function getTables(client: Client): Promise<string[]> {
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)
  return result.rows.map((row) => row.table_name)
}

async function getTableRowCounts(client: Client, tables: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>()

  for (const table of tables) {
    const result = await client.query(`SELECT COUNT(*) as count FROM "${table}"`)
    counts.set(table, parseInt(result.rows[0].count))
  }

  return counts
}

async function main() {
  console.log('⚠️  PRODUCTION DATABASE CLEAR SCRIPT ⚠️\n')

  // Load production environment
  dotenv.config({ path: path.resolve(process.cwd(), '.env.prod') })
  const prodHost = process.env.POSTGRES_HOST
  const prodUrl = buildConnectionString('POSTGRES')

  console.log('🎯 Target Database:', prodHost)
  console.log()

  const client = new Client({ connectionString: prodUrl })

  try {
    await client.connect()
    console.log('✅ Connected to production database\n')

    // Get all tables
    const tables = await getTables(client)
    console.log(`📊 Found ${tables.length} tables\n`)

    // Get row counts
    console.log('📋 Current data in production:')
    const counts = await getTableRowCounts(client, tables)
    let totalRows = 0

    for (const [table, count] of counts.entries()) {
      if (count > 0) {
        console.log(`  - ${table}: ${count} rows`)
        totalRows += count
      }
    }

    if (totalRows === 0) {
      console.log('\n✅ Production database is already empty!')
      process.exit(0)
    }

    console.log(`\n  TOTAL: ${totalRows} rows across ${tables.length} tables\n`)

    // Confirmation
    console.log('⚠️  WARNING: This will DELETE ALL DATA from production!')
    console.log('⚠️  This action CANNOT be undone!\n')

    const confirmed = await promptConfirmation('Type "yes" to confirm deletion: ')

    if (!confirmed) {
      console.log('\n❌ Operation cancelled.')
      process.exit(0)
    }

    console.log('\n🗑️  Clearing all tables...\n')

    // Use TRUNCATE CASCADE which handles foreign keys automatically
    // Build a list of all table names
    const tableList = tables.map((t) => `"${t}"`).join(', ')

    try {
      // TRUNCATE all tables at once with CASCADE to handle foreign keys
      await client.query(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`)

      for (const table of tables) {
        const count = counts.get(table) || 0
        if (count > 0) {
          console.log(`  ✅ Cleared ${table} (${count} rows deleted)`)
        }
      }
    } catch (error) {
      console.log('⚠️  TRUNCATE failed, trying DELETE approach...\n')

      // Fallback: Delete in reverse order
      const reversedTables = [...tables].reverse()
      for (const table of reversedTables) {
        const count = counts.get(table) || 0
        if (count > 0) {
          await client.query(`DELETE FROM "${table}"`)
          console.log(`  ✅ Cleared ${table} (${count} rows deleted)`)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ PRODUCTION DATABASE CLEARED!')
    console.log('='.repeat(60))
    console.log(`\n  ${totalRows} total rows deleted from ${tables.length} tables\n`)
  } catch (error) {
    console.error('\n❌ Error clearing database:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
