import type { Payload } from 'payload'

export interface MediaUsageInfo {
  isUsed: boolean
  usedIn: {
    collection: string
    count: number
  }[]
}

type MediaId = string | number

const COLLECTIONS_USING_MEDIA = ['pages', 'posts'] as const

/**
 * Collects the IDs of every media document referenced anywhere in `value`.
 *
 * Documents are fetched at depth 1, so each media reference (hero, mobile
 * hero, SEO image, or an upload nested in rich-text blocks) arrives as a
 * populated media object. Matching on objects that carry a `filename` keeps
 * other related documents with the same numeric ID (categories, related
 * posts, authors) from counting as media.
 */
function collectMediaIds(value: unknown, found: Set<string>): void {
  if (!value || typeof value !== 'object') return

  if (Array.isArray(value)) {
    for (const item of value) collectMediaIds(item, found)
    return
  }

  const record = value as Record<string, unknown>
  if ('filename' in record && 'id' in record && record.id != null) {
    found.add(String(record.id))
  }

  for (const child of Object.values(record)) collectMediaIds(child, found)
}

/**
 * Works out where each media item is used, reading every page and post once
 * rather than once per media item.
 */
export async function checkMultipleMediaUsage(
  payload: Payload,
  mediaIds: MediaId[],
): Promise<Map<MediaId, MediaUsageInfo>> {
  // media ID -> collection -> number of documents using it
  const counts = new Map<string, Map<string, number>>()

  for (const collection of COLLECTIONS_USING_MEDIA) {
    const { docs } = await payload.find({
      collection,
      depth: 1,
      pagination: false,
    })

    for (const doc of docs) {
      const found = new Set<string>()
      collectMediaIds(doc, found)

      for (const id of found) {
        const byCollection = counts.get(id) ?? new Map<string, number>()
        byCollection.set(collection, (byCollection.get(collection) ?? 0) + 1)
        counts.set(id, byCollection)
      }
    }
  }

  const results = new Map<MediaId, MediaUsageInfo>()
  for (const id of mediaIds) {
    const byCollection = counts.get(String(id))
    const usedIn = byCollection
      ? [...byCollection].map(([collection, count]) => ({ collection, count }))
      : []
    results.set(id, { isUsed: usedIn.length > 0, usedIn })
  }

  return results
}
