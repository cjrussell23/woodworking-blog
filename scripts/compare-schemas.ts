import * as dotenv from 'dotenv'
import * as path from 'path'
import { Client } from 'pg'

interface TableSchema {
  tableName: string
  columns: Array<{
    columnName: string
    dataType: string
    isNullable: string
    columnDefault: string | null
    characterMaximumLength: number | null
  }>
  indexes: Array<{
    indexName: string
    columnName: string
    isUnique: boolean
  }>
  constraints: Array<{
    constraintName: string
    constraintType: string
    columnName: string
  }>
}

async function getSchema(connectionString: string): Promise<Map<string, TableSchema>> {
  const client = new Client({ connectionString })
  await client.connect()

  try {
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    const schema = new Map<string, TableSchema>()

    for (const { table_name } of tablesResult.rows) {
      // Get columns
      const columnsResult = await client.query(
        `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `,
        [table_name],
      )

      // Get indexes
      const indexesResult = await client.query(
        `
        SELECT 
          i.relname AS index_name,
          a.attname AS column_name,
          ix.indisunique AS is_unique
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE t.relname = $1
        AND t.relkind = 'r'
        ORDER BY i.relname, a.attnum
      `,
        [table_name],
      )

      // Get constraints
      const constraintsResult = await client.query(
        `
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name
        FROM information_schema.table_constraints tc
        LEFT JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public' 
        AND tc.table_name = $1
        ORDER BY tc.constraint_name
      `,
        [table_name],
      )

      schema.set(table_name, {
        tableName: table_name,
        columns: columnsResult.rows.map((row) => ({
          columnName: row.column_name,
          dataType: row.data_type,
          isNullable: row.is_nullable,
          columnDefault: row.column_default,
          characterMaximumLength: row.character_maximum_length,
        })),
        indexes: indexesResult.rows.map((row) => ({
          indexName: row.index_name,
          columnName: row.column_name,
          isUnique: row.is_unique,
        })),
        constraints: constraintsResult.rows.map((row) => ({
          constraintName: row.constraint_name,
          constraintType: row.constraint_type,
          columnName: row.column_name,
        })),
      })
    }

    return schema
  } finally {
    await client.end()
  }
}

function compareSchemas(
  devSchema: Map<string, TableSchema>,
  productionSchema: Map<string, TableSchema>,
): { match: boolean; differences: string[] } {
  const differences: string[] = []

  // Check for tables only in dev
  for (const tableName of devSchema.keys()) {
    if (!productionSchema.has(tableName)) {
      differences.push(`❌ Table "${tableName}" exists in dev but not in production`)
    }
  }

  // Check for tables only in production
  for (const tableName of productionSchema.keys()) {
    if (!devSchema.has(tableName)) {
      differences.push(`❌ Table "${tableName}" exists in production but not in dev`)
    }
  }

  // Compare tables that exist in both
  for (const [tableName, devTable] of devSchema.entries()) {
    const productionTable = productionSchema.get(tableName)
    if (!productionTable) continue

    // Compare columns
    const devCols = new Map(devTable.columns.map((c) => [c.columnName, c]))
    const productionCols = new Map(productionTable.columns.map((c) => [c.columnName, c]))

    for (const [colName, devCol] of devCols.entries()) {
      const prodCol = productionCols.get(colName)
      if (!prodCol) {
        differences.push(`❌ Column "${tableName}.${colName}" exists in dev but not in production`)
      } else {
        if (devCol.dataType !== prodCol.dataType) {
          differences.push(
            `❌ Column "${tableName}.${colName}" has different data types: dev="${devCol.dataType}", production="${prodCol.dataType}"`,
          )
        }
        if (devCol.isNullable !== prodCol.isNullable) {
          differences.push(
            `⚠️  Column "${tableName}.${colName}" has different nullable constraints`,
          )
        }
      }
    }

    for (const colName of productionCols.keys()) {
      if (!devCols.has(colName)) {
        differences.push(`❌ Column "${tableName}.${colName}" exists in production but not in dev`)
      }
    }
  }

  return {
    match: differences.length === 0,
    differences,
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
  console.log('🔍 Comparing database schemas...\n')

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

  try {
    console.log('Fetching dev schema...')
    const devSchema = await getSchema(devUrl)
    console.log(`✅ Found ${devSchema.size} tables in dev\n`)

    console.log('Fetching production schema...')
    const productionSchema = await getSchema(prodUrl)
    console.log(`✅ Found ${productionSchema.size} tables in production\n`)

    const { match, differences } = compareSchemas(devSchema, productionSchema)

    if (match) {
      console.log('✅ ✅ ✅ SCHEMAS MATCH! ✅ ✅ ✅')
      console.log('\nIt is safe to proceed with data copy.')
      process.exit(0)
    } else {
      console.log('❌ SCHEMAS DO NOT MATCH')
      console.log('\nDifferences found:')
      differences.forEach((diff) => console.log(`  ${diff}`))
      console.log('\n⚠️  Data copy should NOT proceed until schemas are aligned.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error comparing schemas:', error)
    process.exit(1)
  }
}

main()
