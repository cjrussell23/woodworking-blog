import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables first
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

// Import after loading env vars
const { getPayload } = await import('payload')
const configModule = await import('../src/payload.config.js')
const config = configModule.default

/**
 * Migration script to transform mediaBlock to imageBlock in posts
 * This updates the actual database records
 */
async function migrateMediaBlocks() {
  console.log('🚀 Starting mediaBlock to imageBlock migration...\n')

  const payload = await getPayload({ config })

  try {
    // Fetch all posts (including drafts)
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      depth: 0,
    })

    console.log(`📊 Found ${posts.totalDocs} posts to check\n`)

    let updatedCount = 0
    let skippedCount = 0

    for (const post of posts.docs) {
      let needsUpdate = false
      let migratedContent = post.content

      // Check if the post has content with blocks
      if (post.content?.root?.children) {
        // Deep clone to avoid mutating the original
        migratedContent = JSON.parse(JSON.stringify(post.content))

        // Recursively transform blocks
        const transformBlocks = (node: any): boolean => {
          let changed = false

          if (!node) return changed

          // Transform mediaBlock to imageBlock
          if (node.fields?.blockType === 'mediaBlock') {
            console.log(`  🔄 Found mediaBlock in post: "${post.title}" (ID: ${post.id})`)
            node.fields.blockType = 'imageBlock'
            changed = true
            needsUpdate = true
          }

          // Recursively process children
          if (Array.isArray(node.children)) {
            for (const child of node.children) {
              if (transformBlocks(child)) {
                changed = true
              }
            }
          }

          return changed
        }

        // Process all children
        for (const child of migratedContent.root.children) {
          transformBlocks(child)
        }
      }

      // Update the post if changes were made
      if (needsUpdate) {
        try {
          await payload.update({
            collection: 'posts',
            id: post.id,
            data: {
              content: migratedContent,
            },
            context: {
              disableRevalidate: true, // Skip revalidation in script context
            },
          })
          console.log(`  ✅ Updated post: "${post.title}"\n`)
          updatedCount++
        } catch (error) {
          console.error(`  ❌ Error updating post "${post.title}":`, error)
        }
      } else {
        skippedCount++
      }
    }

    console.log('\n═══════════════════════════════════════')
    console.log('📈 Migration Summary:')
    console.log(`   Total posts checked: ${posts.totalDocs}`)
    console.log(`   Posts updated: ${updatedCount}`)
    console.log(`   Posts skipped: ${skippedCount}`)
    console.log('═══════════════════════════════════════\n')

    if (updatedCount > 0) {
      console.log('✨ Migration completed successfully!')
    } else {
      console.log('ℹ️  No posts needed migration.')
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run the migration
migrateMediaBlocks()
