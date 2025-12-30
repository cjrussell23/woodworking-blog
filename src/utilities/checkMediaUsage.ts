import type { Payload } from 'payload'

export interface MediaUsageInfo {
  isUsed: boolean
  usedIn: {
    collection: string
    count: number
  }[]
}

/**
 * Check if a media item is being used in any collection
 * @param payload - Payload instance
 * @param mediaId - ID of the media item to check
 * @returns Information about where the media is being used
 */
export async function checkMediaUsage(
  payload: Payload,
  mediaId: string | number,
): Promise<MediaUsageInfo> {
  const id = String(mediaId)
  const usedIn: { collection: string; count: number }[] = []

  // Collections that might reference media
  const collectionsToCheck = ['pages', 'posts']

  for (const collection of collectionsToCheck) {
    try {
      // First, try to find documents by hero media
      const heroResult = await payload.find({
        collection: collection as 'pages' | 'posts',
        where: {
          'hero.media': { equals: id },
        },
        limit: 0,
        depth: 0,
      })

      // Then try to find by meta image
      const metaResult = await payload.find({
        collection: collection as 'pages' | 'posts',
        where: {
          'meta.image': { equals: id },
        },
        limit: 0,
        depth: 0,
      })

      // For content blocks, we need to fetch all documents and check manually
      // since Payload doesn't support deep querying into lexical content
      const allDocs = await payload.find({
        collection: collection as 'pages' | 'posts',
        limit: 1000, // Adjust based on your needs
        depth: 1,
      })

      let contentMatches = 0
      for (const doc of allDocs.docs) {
        if (hasMediaInContent(doc.content, id)) {
          contentMatches++
        }
      }

      const totalMatches = heroResult.totalDocs + metaResult.totalDocs + contentMatches

      if (totalMatches > 0) {
        usedIn.push({
          collection,
          count: totalMatches,
        })
      }
    } catch (error) {
      console.error(`Error checking ${collection} for media ${mediaId}:`, error)
    }
  }

  return {
    isUsed: usedIn.length > 0,
    usedIn,
  }
}

/**
 * Recursively check if media is referenced in content
 */
function hasMediaInContent(content: any, mediaId: string | number): boolean {
  if (!content) return false

  // Handle arrays
  if (Array.isArray(content)) {
    return content.some((item) => hasMediaInContent(item, mediaId))
  }

  // Handle objects
  if (typeof content === 'object') {
    // Check if this is a media reference
    if (content.id === mediaId) return true

    // Recursively check all properties
    return Object.values(content).some((value) => hasMediaInContent(value, mediaId))
  }

  // Handle primitives
  return content === mediaId
}

/**
 * Get usage information for multiple media items
 * @param payload - Payload instance
 * @param mediaIds - Array of media IDs to check
 * @returns Map of media ID to usage information
 */
export async function checkMultipleMediaUsage(
  payload: Payload,
  mediaIds: (string | number)[],
): Promise<Map<string | number, MediaUsageInfo>> {
  const results = new Map<string | number, MediaUsageInfo>()

  // Check usage in parallel for better performance
  const checks = mediaIds.map(async (id) => {
    const usage = await checkMediaUsage(payload, id)
    return { id, usage }
  })

  const allResults = await Promise.all(checks)

  for (const { id, usage } of allResults) {
    results.set(id, usage)
  }

  return results
}
