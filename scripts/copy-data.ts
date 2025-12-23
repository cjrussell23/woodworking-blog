import * as dotenv from 'dotenv'
import * as path from 'path'
import { Client } from 'pg'

interface TableInfo {
  tableName: string
  rowCount: number
}

async function getTableDependencyOrder(client: Client): Promise<string[]> {
  // Get all tables
  const allTablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)

  const allTables = allTablesResult.rows.map((row) => row.table_name)

  // Get foreign key relationships
  const fkResult = await client.query(`
    SELECT 
      tc.table_name as child_table,
      ccu.table_name as parent_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name != ccu.table_name
  `)

  // Build dependency map
  const dependencies = new Map<string, Set<string>>()
  for (const table of allTables) {
    dependencies.set(table, new Set())
  }

  for (const row of fkResult.rows) {
    dependencies.get(row.child_table)?.add(row.parent_table)
  }

  // Topological sort
  const sorted: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(table: string): void {
    if (visited.has(table)) return
    if (visiting.has(table)) {
      // Circular dependency - skip for now
      return
    }

    visiting.add(table)
    const deps = dependencies.get(table) || new Set()

    for (const dep of deps) {
      visit(dep)
    }

    visiting.delete(table)
    visited.add(table)
    sorted.push(table)
  }

  for (const table of allTables) {
    visit(table)
  }

  return sorted
}

async function copyTableData(
  sourceClient: Client,
  targetClient: Client,
  tableName: string,
): Promise<number> {
  // Get row count
  const countResult = await sourceClient.query(`SELECT COUNT(*) as count FROM "${tableName}"`)
  const rowCount = parseInt(countResult.rows[0].count)

  if (rowCount === 0) {
    console.log(`  ⏭️  Table "${tableName}" is empty, skipping...`)
    return 0
  }

  console.log(`  📋 Copying ${rowCount} rows from "${tableName}"...`)

  // Get all columns
  const columnsResult = await sourceClient.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `,
    [tableName],
  )

  const columns = columnsResult.rows.map((row) => `"${row.column_name}"`).join(', ')

  // Fetch all data
  const dataResult = await sourceClient.query(`SELECT ${columns} FROM "${tableName}"`)

  if (dataResult.rows.length === 0) {
    return 0
  }

  // Insert data in batches (without disabling triggers - use transaction instead)
  let insertedCount = 0
  const batchSize = 100

  for (let i = 0; i < dataResult.rows.length; i += batchSize) {
    const batch = dataResult.rows.slice(i, i + batchSize)

    for (const row of batch) {
      const values = Object.values(row)
      const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ')

      await targetClient.query(
        `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders})`,
        values,
      )
      insertedCount++
    }

    if (insertedCount % 100 === 0) {
      console.log(`    ⏳ Inserted ${insertedCount}/${rowCount} rows...`)
    }
  }

  console.log(`  ✅ Copied ${insertedCount} rows to "${tableName}"`)
  return insertedCount
}

async function resetSequences(client: Client, tables: string[]) {
  console.log('\n🔄 Resetting sequences...')

  for (const tableName of tables) {
    const sequencesResult = await client.query(
      `
      SELECT 
        column_name,
        pg_get_serial_sequence($1, column_name) as sequence_name
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = $1
      AND pg_get_serial_sequence($1, column_name) IS NOT NULL
    `,
      [tableName],
    )

    for (const { column_name, sequence_name } of sequencesResult.rows) {
      await client.query(
        `
        SELECT setval($1, COALESCE((SELECT MAX("${column_name}") FROM "${tableName}"), 1), true)
      `,
        [sequence_name],
      )
      console.log(`  ✅ Reset sequence for "${tableName}"."${column_name}"`)
    }
  }
}

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

async function main() {
  console.log('🚀 Starting data copy from dev to production...\n')

  // Load dev environment
  dotenv.config({ path: path.resolve(process.cwd(), '.env.development') })
  const devHost = process.env.POSTGRES_HOST
  const devUrl = buildConnectionString('POSTGRES')

  // Load production environment
  dotenv.config({ path: path.resolve(process.cwd(), '.env.production'), override: true })
  const prodHost = process.env.POSTGRES_HOST
  const prodUrl = buildConnectionString('POSTGRES')

  // Verify hosts are different
  if (devHost === prodHost) {
    console.error('❌ ERROR: Dev and Production hosts are the SAME!')
    console.error(`   Both are: ${devHost}`)
    console.error('\n   This would cause data to be copied to itself.')
    console.error('   Please check your .env.development and .env.production files.\n')
    process.exit(1)
  }

  console.log('📊 Dev DB:', devHost)
  console.log('📊 Production DB:', prodHost)
  console.log()

  const devClient = new Client({ connectionString: devUrl })
  const productionClient = new Client({ connectionString: prodUrl })

  try {
    await devClient.connect()
    await productionClient.connect()

    console.log('✅ Connected to both databases\n')

    // Get table order based on dependencies
    console.log('🔍 Analyzing table dependencies...')
    const tables = await getTableDependencyOrder(devClient)
    console.log(`✅ Found ${tables.length} tables in dependency order\n`)

    // Verify production is empty
    console.log('🔍 Verifying production database is empty...')
    const prodTableCounts = await Promise.all(
      tables.map(async (table) => {
        const result = await productionClient.query(`SELECT COUNT(*) as count FROM "${table}"`)
        return { table, count: parseInt(result.rows[0].count) }
      }),
    )

    const nonEmptyTables = prodTableCounts.filter((t) => t.count > 0)
    if (nonEmptyTables.length > 0) {
      console.log('⚠️  WARNING: Production database is NOT empty!')
      nonEmptyTables.forEach((t) => console.log(`  - ${t.table}: ${t.count} rows`))
      console.log('\n❌ Aborting to prevent data loss. Please clear production database first.')
      process.exit(1)
    }
    console.log('✅ Production database is empty, proceeding...\n')

    // Copy data for each table
    console.log('📦 Copying data...\n')
    const results: TableInfo[] = []

    for (const tableName of tables) {
      const rowCount = await copyTableData(devClient, productionClient, tableName)
      results.push({ tableName, rowCount })
    }

    // Reset sequences
    await resetSequences(productionClient, tables)

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ DATA COPY COMPLETE!')
    console.log('='.repeat(60))
    console.log('\nSummary:')
    console.log(`  Total tables: ${results.length}`)
    console.log(`  Total rows copied: ${results.reduce((sum, r) => sum + r.rowCount, 0)}`)
    console.log('\nPer table:')
    results
      .filter((r) => r.rowCount > 0)
      .forEach((r) => console.log(`  - ${r.tableName}: ${r.rowCount} rows`))
  } catch (error) {
    console.error('\n❌ Error during data copy:', error)
    process.exit(1)
  } finally {
    await devClient.end()
    await productionClient.end()
  }
}

main()
